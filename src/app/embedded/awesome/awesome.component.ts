/**
 * Demonstrates use of the embedded component element's "...Content" property.
 */

import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  /* tslint:disable component-selector */
  selector: 'awesome',
  template: '<span></span>'
})
export class AwesomeComponent implements OnInit {

  hostElement: HTMLElement;

  constructor(private elementRef: ElementRef) {
    this.hostElement = this.elementRef.nativeElement;
   }

  ngOnInit() {

    // The `awesomeContent` property is set by the DocViewer when it builds this component.
    // It is the original innerHTML of the host element.
    let content: string = this.hostElement['awesomeContent'];

    // Manipulate that content:
    // Follow every "the" or "The" with "awesome"
    content = content.replace(/([Tt]he) /g, '$1 awesome ');

    // Precede every "The" with "OMG!"
    content = content.replace(/(The) /g, '<b>OMG!</b> $1 ');

    // stuff it into the component's element
    // **Security:** `awesomeContent` is provided by Development Team
    // and is considered safe.
    this.hostElement.innerHTML = content;

  }
}
