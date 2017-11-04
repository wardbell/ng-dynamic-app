import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';


import { getBoolFromAttribute } from 'app/shared/attribute-utils';

export interface TabInfo {
  class: string;
  code: string;
  hideCopy: boolean;
  isAvoid: boolean;
  language: string;
  linenums: any;
  path: string;
  region: string;
  title: string;
}

/**
 * An embedded component used to generate tabbed code panes inside docs
 *
 * The innerHTML of the `<code-tabs>` component should contain `<code-pane>` elements.
 * Each `<code-pane>` has the same interface as the embedded `<code-example>` component.
 * The optional `linenums` attribute is the default `linenums` for each code pane.
 */
@Component({
  /* tslint:disable component-selector */
  selector: 'code-tabs',
  template: `
    <mat-tab-group  #tabgroup class="code-tab-group" [class.avoid]="tabIsAvoid" disableRipple>
      <mat-tab *ngFor="let tab of tabs">
        <ng-template mat-tab-label>
          <span class="{{ tab.class }}" [class.avoid]="tab.isAvoid">{{ tab.title }}</span>
        </ng-template>
        <!--<pre>Debugging:\n{{tab.code}}</pre> -->
        <!-- [code] binding needed because cannot project interpolation -->
        <aio-code class="{{ tab.class }}"
          [code]="tab.code"
          [hideCopy]="tab.hideCopy"
          [language]="tab.language"
          [linenums]="tab.linenums"
          [path]="tab.path"
          [region]="tab.region"
          [title]="tab.title">
          <!-- {{code.tabs}} sadly interpolation projection does not work! -->
        </aio-code>
      </mat-tab>
    </mat-tab-group>
    <span #content style="display:none">
      <ng-content></ng-content>
    </span>
  `
})
export class CodeTabsComponent implements OnInit {
  @ViewChild('content') contentRef: ElementRef;
  @ViewChild('tabgroup') tabGroup: MatTabGroup;

  tabIsAvoid = false;
  tabs: TabInfo[];
  linenumsDefault: string;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    const hostElement = this.elementRef.nativeElement;
    this.linenumsDefault = this.getLinenums(hostElement);

    this.tabGroup.selectedIndexChange.subscribe(index => {
      this.tabIsAvoid = this.tabs[index].isAvoid;
    });

    // The `codeTabsContent` property is set by the DocViewer when it builds this component.
    // It is the original innerHTML of the host element.
    const content = hostElement.codeTabsContent;
    this.processContent();
  }

  processContent() {
    // **Security:** `codeTabsContent` is provided by docs authors and as such is considered to be safe for innerHTML purposes.
    const content = this.contentRef.nativeElement;


    this.tabs = [];
    const codeExamples = content.querySelectorAll('code-pane');
    this.contentRef.nativeElement.innerHTML = ''; // don't need it anymore

    for (let i = 0; i < codeExamples.length; i++) {
      const codeExample = codeExamples.item(i);

      const path = codeExample.getAttribute('path') || '';
      const isAvoid = (path || '').indexOf('.avoid.') !== -1;
      const hideCopy = isAvoid || getBoolFromAttribute(codeExample, ['hidecopy', 'hide-copy']);

      const tab = {
        class: codeExample.getAttribute('class'),
        code: codeExample.innerHTML,
        hideCopy,
        isAvoid,
        language: codeExample.getAttribute('language'),
        linenums: this.getLinenums(codeExample),
        path: path,
        region: codeExample.getAttribute('region') || '',
        title: codeExample.getAttribute('title')
      };
      this.tabs.push(tab);
    }
  }

  getLinenums(element: Element) {
    const linenums = element.getAttribute('linenums');
    return linenums == null ? this.linenumsDefault : linenums;
  }
}
