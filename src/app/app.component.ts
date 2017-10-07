import { Component, HostListener, OnInit } from '@angular/core';
import { DocumentContents, DocumentService } from 'app/shared/document.service';
import { LocationService } from 'app/shared/location.service';
import { ScrollService } from 'app/shared/scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  currentDocument: DocumentContents;
  currentPath: string;

  constructor(
    private documentService: DocumentService,
    private locationService: LocationService,
    private scrollService: ScrollService
  ) { }

  ngOnInit() {
    /* No need to unsubscribe because this root component never dies */

    this.documentService.currentDocument.subscribe(doc => {
      this.currentDocument = doc;
    });

    this.locationService.currentPath.subscribe(path => {

      if (path === this.currentPath) {
        // scroll only if on same page (most likely a change to the hash)
        this.autoScroll();
      } else {
        // don't scroll; leave that to `onDocRendered`
        this.currentPath = path;
      }
    });
  }

  // Scroll to the anchor in the hash fragment or top of doc.
  autoScroll() {
    this.scrollService.scroll();
  }

  onDocRendered() {
    // Put page in a clean visual state
    this.scrollService.scrollToTop();

    // Scroll 500ms after the doc-viewer has finished rendering the new doc
    // The delay is to allow time for async layout to complete
    setTimeout(() => {
      this.autoScroll();
    }, 500);
  }
  @HostListener('click', ['$event.target', '$event.button', '$event.ctrlKey', '$event.metaKey', '$event.altKey'])
  onClick(eventTarget: HTMLElement, button: number, ctrlKey: boolean, metaKey: boolean, altKey: boolean): boolean {

    // Deal with anchor clicks; climb DOM tree until anchor found (or null)
    let target = eventTarget;
    while (target && !(target instanceof HTMLAnchorElement)) {
      target = target.parentElement;
    }
    if (target instanceof HTMLAnchorElement) {
      return this.locationService.handleAnchorClick(target, button, ctrlKey, metaKey);
    }

    // Allow the click to pass through
    return true;
  }
}
