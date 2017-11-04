/**
 * A supporting component that appears in the templates of two
 * embedded components, CodeExampleComponent and CodeTabsComponent.
 */

import { Component, ElementRef, ViewChild, OnChanges, OnDestroy, Input } from '@angular/core';
import { PrettyPrinter } from './pretty-printer.service';
import { CopierService } from 'app/shared/copier.service';
import { MatSnackBar } from '@angular/material';

const originalLabel = 'Copy Code';
const copiedLabel = 'Copied!';
const defaultLineNumsCount = 10; // by default, show linenums over this number

/**
 * Formatted Code Block
 *
 * Pretty renders a code block, used in the docs and API reference by the code-example and
 * code-tabs embedded components.
 * It includes a "copy" button that will send the content to the clipboard when clicked
 *
 * Example usage:
 *
 * ```
 * <aio-code
 *   [code]="variableContainingCode"
 *   [language]="ts"
 *   [linenums]="true"
 *   [path]="router/src/app/app.module.ts"
 *   [region]="animations-module">
 * </aio-code>
 * ```
 */
@Component({
  /* tslint:disable component-selector */
  selector: 'aio-code',
  template: `
    <pre class="prettyprint lang-{{language}}">
      <button *ngIf="!hideCopy" class="copy-button"
        title="Copy code snippet"
        [attr.aria-label]="ariaLabel"
        (click)="doCopy()">Copy</button>
      <code class="animated fadeIn" #codeContainer>
        <ng-content></ng-content>
      </code>
    </pre>
    `
})
export class CodeComponent implements OnChanges {

  ariaLabel = '';

  /**
   * Code to show as HTML string.
   * Use when there is no projected content.
   * See `CodeTabsComponent` to understand why this option is necessary.
   */
  @Input() code: string;

  /**
   * The code to be copied when clicking the copy button, this should not be HTML encoded
   */
  private codeText: string;

  /**
   * set to true if the copy button is not to be shown
   */
  @Input()
  hideCopy: boolean;

  /**
   * The language of the code to render
   * (could be javascript, dart, typescript, etc)
   */
  @Input()
  language: string;

  /**
   * Whether to display line numbers:
   *  - false: don't display
   *  - true: do display
   *  - number: do display but start at the given number
   */
  @Input()
  linenums: boolean | number | string;

  /**
   * path to the source of the code being displayed
   */
  @Input()
  path: string;

  /**
   * region of the source of the code being displayed
   */
  @Input()
  region: string;

  /**
   * title for this snippet (optional)
   */
  @Input()
  title: string;

  /**
   * The element in the template that will display the formatted code
   */
  @ViewChild('codeContainer') codeContainer: ElementRef;

  constructor(
    private snackbar: MatSnackBar,
    private pretty: PrettyPrinter,
    private copier: CopierService) {}

  ngOnChanges() {

    const code = leftAlign(this.code || this.codeContainer.nativeElement.innerHTML);

    this.ariaLabel = 'Copy code snippet' + (this.title ? ` from ${this.title}` : '');

    if (!code) {
      const src = this.path ? this.path + (this.region ? '#' + this.region : '') : '';
      const srcMsg = src ? ` for\n${src}` : '.';
      this.setCodeHtml(`<p class="code-missing">The code sample is missing${srcMsg}</p>`);
      return;
    }

    const linenums = this.getLinenums(code);

    this.setCodeHtml(code); // start with unformatted code
    this.codeText = this.getCodeText(); // store the unformatted code as text (for copying)

    // pretty-print non-terminal code
    if (this.language !== 'bash' && this.language !== 'sh') {
      this.pretty.formatCode(code, this.language, linenums).subscribe(
        formattedCode => this.setCodeHtml(formattedCode),
        err => { /* ignore failure to format */ }
      );
    }
  }

  private setCodeHtml(formattedCode: string) {
    // **Security:** `codeExampleContent` is provided by docs authors and as such its considered to
    // be safe for innerHTML purposes.
    this.codeContainer.nativeElement.innerHTML = formattedCode;
  }

  private getCodeText() {
    // `prettify` may remove newlines, e.g. when `linenums` are on. Retrieve the content of the
    // container as text, before prettifying it.
    // We take the textContent because we don't want it to be HTML encoded.
    return this.codeContainer.nativeElement.textContent;
  }

  doCopy() {
    const code = this.codeText;
    if (this.copier.copyText(code)) {
      console.log('Copied code to clipboard:', code);
      // success snackbar alert
      this.snackbar.open('Code Copied', '', { duration: 800 });
    } else {
      console.error('ERROR copying code to clipboard:', code);
      // failure snackbar alert
      this.snackbar.open('Copy failed. Please try again!', '', { duration: 800 });
    }
  }

  getLinenums(code: string) {
    const linenums =
      typeof this.linenums === 'boolean' ? this.linenums :
      this.linenums === 'true' ? true :
      this.linenums === 'false' ? false :
      typeof this.linenums === 'string' ? parseInt(this.linenums, 10) :
      this.linenums;

    // if no linenums, enable line numbers if more than one line
    return linenums == null || linenums === NaN ?
      (code.match(/\n/g) || []).length > defaultLineNumsCount : linenums;
  }
}

function leftAlign(text) {
  if (!text) { return ''; }
  let indent = Number.MAX_VALUE;
  const lines = text.split('\n');
  lines.forEach(line => {
    const lineIndent = line.search(/\S/);
    if (lineIndent !== -1) {
      indent = Math.min(lineIndent, indent);
    }
  });
  return lines.map(line => line.substr(indent)).join('\n').trim();
}
