/**
 * Demonstrates use of the embedded component element's "...Content" property.
 */

import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  /* tslint:disable component-selector */
  selector: 'awesome',
  template: '<ng-content></ng-content>'
})
export class AwesomeComponent implements OnInit {

  hostElement: HTMLElement;

  constructor(private elementRef: ElementRef) {
    this.hostElement = this.elementRef.nativeElement;
   }

  ngOnInit() {
    let content = this.hostElement.innerHTML;

    // Follow every "the" or "The" with "awesome"
    content = content.replace(/([Tt]he) /g, '$1 awesome ');

    // Precede every "The" with "OMG!"
    content = content.replace(/(The) /g, '<b>OMG!</b> $1 ');

    // stuff it into the component's element
    // **Security:** manipulates the innerHTML from safe source in a safe way.
    this.hostElement.innerHTML = content;
  }
}
