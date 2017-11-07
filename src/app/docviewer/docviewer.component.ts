import {
  Component, ComponentFactory, ComponentFactoryResolver, ComponentRef,
  DoCheck, ElementRef, EventEmitter, Injector, Input, OnDestroy,
  Output, ViewEncapsulation
} from '@angular/core';

import { EmbeddableComponentsService } from 'app/embedded/embedded.module';
import { DocumentContents } from 'app/shared/document.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-doc-viewer',
  template: '<span></span>'
})
export class DocViewerComponent implements DoCheck, OnDestroy {

  private embeddableComponentFactories: Map<string, ComponentFactory<any>>;
  private embeddedComponentInstances: ComponentRef<any>[] = [];
  private docElement: HTMLElement;

  @Output()
  docRendered = new EventEmitter();

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    docElementRef: ElementRef,
    embeddableComponentsService: EmbeddableComponentsService,
    private injector: Injector,
    private titleService: Title
    ) {
    this.docElement = docElementRef.nativeElement;

    // Create factories for each type of embeddable component
    this.createEmbeddedComponentFactories(embeddableComponentsService, componentFactoryResolver);
  }

  @Input()
  set doc(newDoc: DocumentContents) {
    this.onDocChanged();
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
    this.docElement.innerHTML = doc.contents || '';

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
    this.onDocChanged();
  }

  //// helpers ////

  /** Add the doc's first <h1>'s content as the browser tab (and button) title */
  private addTitle() {
    let title = '';
    const titleEl = this.docElement.querySelector('h1');
    if (titleEl) {
      title = (titleEl.innerText || titleEl.textContent).trim();
    }
    this.titleService.setTitle(title ? `Ng Dynamic - ${title}` : 'Ng Dynamic');
  }

  /**
   * Create the map of EmbeddedComponentFactories, keyed by their selectors.
   * @param embeddableComponents The embedded component classes
   * @param componentFactoryResolver Finds the ComponentFactory for a given Component
   */
  private createEmbeddedComponentFactories(
    embeddableComponents: EmbeddableComponentsService,
    componentFactoryResolver: ComponentFactoryResolver) {

    this.embeddableComponentFactories = new Map<string, ComponentFactory<any>>();

    for (const component of embeddableComponents.components) {
      const componentFactory = componentFactoryResolver.resolveComponentFactory(component);
      const selector = componentFactory.selector;
      this.embeddableComponentFactories.set(selector, componentFactory);
    }
  }

  /**
   * Create and inject embedded components into the current doc content
   * wherever their selectors are found
   **/
  private createEmbeddedComponentInstances() {
    this.embeddableComponentFactories.forEach(
      (componentFactory, selector) => {

      // All current doc elements with this embedded component's selector
      const embeddedComponentElements =
        this.docElement.querySelectorAll(selector) as any as HTMLElement[];

      // Create an Angular embedded component for each element.
      for (const element of embeddedComponentElements){
        const content = [Array.from(element.childNodes)];

        // JUST LIKE BOOTSTRAP
        // factory creates the component, using the DocViewer's parent injector,
        // and replaces the given element's content with the component's resolved template.
        // **Security** Simply forwarding the incoming innerHTML which comes from
        // docs authors and as such is considered to be safe.
        const embeddedComponent =
          componentFactory.create(this.injector, content, element);

        // Assume all attributes are also properties of the component; set them.
        const attributes = (element as any).attributes;
        for (const attr of attributes){
          embeddedComponent.instance[attr.nodeName] = attr.nodeValue;
        }

        this.embeddedComponentInstances.push(embeddedComponent);
      }
    });
  }

  /**
   * Destroy the current embedded component instances
   * or else there will be memory leaks.
   **/
  private onDocChanged() {
    this.embeddedComponentInstances.forEach(comp => comp.destroy());
    this.embeddedComponentInstances.length = 0;
  }
}
