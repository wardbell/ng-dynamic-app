import {
  Component, ComponentFactory, ComponentFactoryResolver, ComponentRef,
  DoCheck, ElementRef, EventEmitter, Inject, Injector, Input, NgModuleFactoryLoader, OnDestroy,
  Output, Type, ViewEncapsulation
} from '@angular/core';

import { DocumentContents } from 'app/shared/document.service';
import { Title } from '@angular/platform-browser';

import { EmbeddedSelector, embeddedSelectorsToken } from 'app/shared/embedded-selectors';
import { NgModuleFactory } from '@angular/core/src/linker/ng_module_factory';

@Component({
  selector: 'app-doc-viewer',
  template: '<span></span>'
})
export class DocViewerComponent implements DoCheck, OnDestroy {

  private embeddableComponentFactories: Map<string, ComponentFactory<any>> = new Map();
  private embeddedComponentInstances: ComponentRef<any>[] = [];
  private loadedLazyModules = [];
  private docElement: HTMLElement;

  @Output()
  docRendered = new EventEmitter();

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    docElementRef: ElementRef,
    @Inject(embeddedSelectorsToken) private embeddedSelectors: EmbeddedSelector[],
    private injector: Injector,
    private titleService: Title
  ) {
    this.docElement = docElementRef.nativeElement;
  }

  @Input()
  set doc(newDoc: DocumentContents) {
    this.onDocChanged();
    if (newDoc) {
      this.build(newDoc).then(() => this.docRendered.emit());
    }
  }

  /**
   * Add doc content to host element and build it out with embedded components
   */
  private build(doc: DocumentContents) {
    let promise = Promise.resolve();

    // security: the doc.content is always authored by the Developer Team
    // and is considered to be safe
    this.docElement.innerHTML = doc.contents || '';
    this.addTitle();
    const selectors = this.embeddedSelectors.map((es: EmbeddedSelector) => es.selector);
    const currentDocComponents = this.docElement.querySelectorAll(selectors.join(', ')); // <fortune></fortune><hero-form></hero-form>
    const currentDocSelectors = this.nodeListToSelectors(currentDocComponents); // fortune, hero-form
    const currentDocModules = this.getDocModules(currentDocSelectors); // EmbeddedModule
    if (!this.isReady(currentDocModules) && currentDocComponents) {
      promise = promise.then(() => this.prepareEmbeddedComponentsFor(currentDocModules));
    }
    promise = promise.then(() => this.createEmbeddedComponentInstances());

    return promise;
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
        for (const element of embeddedComponentElements) {
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
          for (const attr of attributes) {
            embeddedComponent.instance[attr.nodeName] = attr.nodeValue;
          }

          this.embeddedComponentInstances.push(embeddedComponent);
        }
      });
  }

  /**
   * Retrieves all needed modules for the current selectors
   */
  private getDocModules(selectors: string[]) {
    const neededModules: string[] = [];
    selectors.forEach(selector => {
      const module = this.embeddedSelectors.find(es => es.selector === selector).module;
      if (neededModules.indexOf(module) === -1) {
        neededModules.push(module);
      }
    });

    return neededModules;
  }

  /**
   * Checks if a lazy loaded module has been loaded yet
   */
  private isReady(modules: string[]) {
    return modules.reduce((current, module) => {
      return this.loadedLazyModules.indexOf(module) !== -1;
    }, true);
  }

  /**
   * Converts a list of nodes into selectors
   * @param nodeList list of nodes (embedded components) used in the document
   * @returns an array of string
   */
  private nodeListToSelectors(nodeList: NodeList) {
    const selectors: string[] = [];

    for (let i = 0; i < nodeList.length; i++) {
      const name = nodeList[i].nodeName.toLowerCase();
      if (selectors.indexOf(name) === -1) {
        selectors.push(name);
      }
    }

    return selectors;
  }

  private prepareEmbeddedComponentsFor(modules: string[]) {
    let promise = Promise.resolve();

    modules.forEach(module => {
      const ngModuleFactoryLoader: NgModuleFactoryLoader = this.injector.get(NgModuleFactoryLoader);

      promise = ngModuleFactoryLoader
        .load(module)
        .then(ngModuleFactory => {
          const embeddedModuleRef = ngModuleFactory.create(this.injector);
          const embeddedComponents: Type<any>[] = embeddedModuleRef.instance.embeddedComponents;
          const componentFactoryResolver = embeddedModuleRef.componentFactoryResolver;

          for (const component of embeddedComponents) {
            const factory = componentFactoryResolver.resolveComponentFactory(component);
            const selector = factory.selector;
            const contentPropertyName = this.selectorToContentPropertyName(selector);
            this.embeddableComponentFactories.set(selector, factory);
          }
          this.loadedLazyModules.push(module);
        });
    });

    return promise;
  }

  /**
   * Compute the component content property name by converting the selector to camelCase and appending
   * 'Content', e.g. live-example => liveExampleContent
   */
  private selectorToContentPropertyName(selector: string) {
    return selector.replace(/-(.)/g, (match, $1) => $1.toUpperCase()) + 'Content';
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
