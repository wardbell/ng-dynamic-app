import { Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import { getBoolFromAttribute } from 'app/shared/attribute-utils';

/**
 * An embeddable code block that displays nicely formatted code.
 * Example usage:
 *
 * ```
 * <code-example language="ts" linenums="2" class="special" title="Do Stuff">
 * // a code block
 * console.log('do stuff');
 * </code-example>
 * ```
 */
@Component({
  /* tslint:disable component-selector */
  selector: 'code-example',
  template: `
    <header *ngIf="title">{{title}}</header>
    <aio-code
      [ngClass]="classes"
      [hideCopy]="hideCopy"
      [language]="language"
      [linenums]="linenums"
      [path]="path"
      [region]="region"
      [title]="title">
      <ng-content></ng-content>
    </aio-code>
  `
})
export class CodeExampleComponent implements OnInit {

  classes: {};
  hideCopy: boolean;
  language: string;
  linenums: string;
  path: string;
  region: string;
  title: string;

  @HostBinding('class.avoid') isAvoid = false;

  constructor(private elementRef: ElementRef) {  }

  ngOnInit() {
    const element: HTMLElement = this.elementRef.nativeElement;
    // Remove the title attribute to prevent unwanted tooltip popups when hovering over the code.
    element.removeAttribute('title');

    this.isAvoid = (this.path || '').indexOf('.avoid.') !== -1;
    this.hideCopy = this.isAvoid || getBoolFromAttribute(element, ['hidecopy', 'hide-copy']);

    this.classes = {
      'headed-code': !!this.title,
      'simple-code': !this.title,
    };
  }
}
