import {
  Component, ComponentFactory, ComponentFactoryResolver, ComponentRef,
  DoCheck, ElementRef, EventEmitter, Injector, Input, OnDestroy,
  Output, ViewEncapsulation
} from '@angular/core';

import { EmbeddedComponents } from 'app/embedded/embedded.module';
import { DocumentContents } from 'app/shared/document.service';
import { Title } from '@angular/platform-browser';

interface EmbeddedComponentFactory {
  contentPropertyName: string;
  factory: ComponentFactory<any>;
}

// Initialization prevents flicker once pre-rendering is on
const initialDocViewerElement = document.querySelector('app-doc-viewer');
const initialDocViewerContent = initialDocViewerElement ? initialDocViewerElement.innerHTML : '';

@Component({
  selector: 'app-doc-viewer',
  template: ''
})
export class DocViewerComponent implements DoCheck, OnDestroy {

  private embeddedComponentFactories: Map<string, EmbeddedComponentFactory>;
  private embeddedComponentInstances: ComponentRef<any>[] = [];
  private hostElement: HTMLElement;

  @Output()
  docRendered = new EventEmitter();

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    elementRef: ElementRef,
    embeddedComponents: EmbeddedComponents,
    private injector: Injector,
    private titleService: Title
    ) {

    // Security: the initialDocViewerContent comes from the pre-rendered DOM
    // and is considered to be safe
    this.hostElement = elementRef.nativeElement;
    this.hostElement.innerHTML = initialDocViewerContent;

    // Create factories for each type of embedded component
    this.createEmbeddedComponentFactories(embeddedComponents, componentFactoryResolver);
  }

  @Input()
  set doc(newDoc: DocumentContents) {
    this.destroyEmbeddedComponentInstances();
    if (newDoc) {
      this.build(newDoc);
      this.docRendered.emit();
    }
  }

  /**
   * Add doc content to host element and build it out with embedded components
   */
  private build(doc: DocumentContents) {

    // security: the doc.content is always authored by the Developer Team
    // and is considered to be safe
    this.hostElement.innerHTML = doc.contents || '';

    if (!doc.contents) { return; }
    this.addTitle();
    this.createEmbeddedComponentInstances();
  }

  ngDoCheck() {
    this.embeddedComponentInstances.forEach(
      comp => comp.changeDetectorRef.detectChanges()
    );
  }

  ngOnDestroy() {
    this.destroyEmbeddedComponentInstances();
  }

  //// helpers ////

  /** Add the doc's first <h1>'s content as the browser tab (and button) title */
  private addTitle() {
    let title = '';
    const titleEl = this.hostElement.querySelector('h1');
    if (titleEl) {
      title = (titleEl.innerText || titleEl.textContent).trim();
    }
    this.titleService.setTitle(title ? `Ng Dynamic - ${title}` : 'Ng Dynamic');
  }

  /**
   * Create the map of EmbeddedComponentFactories, keyed by their selectors.
   * @param embeddedComponents The embedded component classes
   * @param componentFactoryResolver Finds the ComponentFactory for a given Component
   */
  private createEmbeddedComponentFactories(
    embeddedComponents: EmbeddedComponents,
    componentFactoryResolver: ComponentFactoryResolver) {

    this.embeddedComponentFactories = new Map<string, EmbeddedComponentFactory>();

    for (const component of embeddedComponents.components) {
      const factory = componentFactoryResolver.resolveComponentFactory(component);
      const selector = factory.selector;
      const contentPropertyName = this.selectorToContentPropertyName(selector);
      this.embeddedComponentFactories.set(selector, { contentPropertyName, factory });
    }
  }

  /**
   * Create and inject embedded components into the current doc content
   * wherever their selectors are found
   **/
  private createEmbeddedComponentInstances() {
    this.embeddedComponentFactories.forEach(({ contentPropertyName, factory }, selector) => {

      // All current doc elements with this embedded component's selector
      const embeddedComponentElements =
        // cast thru `any` due to https://github.com/Microsoft/TypeScript/issues/4947
        this.hostElement.querySelectorAll(selector) as any as HTMLElement[];

      // Create an Angular embedded component for each element.
      for (const element of embeddedComponentElements){
        // Preserve the current element content as a property of the element
        // because the component factory will clear the element's content.
        // security: the source of this innerHTML is always authored by the Developer Team
        // and is considered to be safe
        element[contentPropertyName] = element.innerHTML;

        // JUST LIKE BOOTSTRAP
        // factory creates the component, using the DocViewer's parent injector,
        // and replaces the given element's content with the component's resolved template.
        this.embeddedComponentInstances.push(factory.create(this.injector, [], element));
      }
    });
  }

  /**
   * Destroy the current embedded component instances
   * or else there will be memory leaks.
   **/
  private destroyEmbeddedComponentInstances() {
    this.embeddedComponentInstances.forEach(comp => comp.destroy());
    this.embeddedComponentInstances.length = 0;
  }

  /**
   * Compute the component content property name by
   * converting the selector to camelCase and appending the suffix, 'Content'.
   * Ex: live-example => liveExampleContent
   */
  private selectorToContentPropertyName(selector: string) {
    return selector.replace(/-(.)/g, (match, $1) => $1.toUpperCase()) + 'Content';
  }
}
