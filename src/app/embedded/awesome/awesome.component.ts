/**
 * Demonstrates use of the embedded component element's "...Content" property.
 */

import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  /* tslint:disable component-selector */
  selector: 'awesome',
  template: ''
})
export class AwesomeComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
    const element: HTMLElement = this.elementRef.nativeElement.awesomeContent;

  }
  ngOnInit() {
    // The `awesomeContent` property is set by the DocViewer when it builds this component.
    // It is the original innerHTML of the host element.
    // **Security:** `awesomeContent` is provided by Development Team
    // and is considered safe.
    let content: string = this.elementRef.nativeElement.awesomeContent;

    // manipulate that content: replace every "the" with "the awesome"
    content = content.replace(/([Tt]he) /g, '$1 awesome ');

    // stuff it into the component's element
    this.elementRef.nativeElement.innerHTML = content;

  }
}
