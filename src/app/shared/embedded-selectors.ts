import { InjectionToken } from '@angular/core';

export interface EmbeddedSelector {
  selector: string;
  module: string;
}

// These are hard-coded component selectors that correspond to embedded components.
// (Embedded components are created "manually", i.e. not as part of a component's template.)
export const embeddedSelectorsToken = new InjectionToken<string[]>('EmbeddedSelectors');
export const embeddedSelectors: EmbeddedSelector[] = [
  { selector: 'awesome', module: 'app/embedded/embedded.module#EmbeddedModule' },
  { selector: 'fortune', module: 'app/embedded/embedded.module#EmbeddedModule' },
  { selector: 'code-example', module: 'app/embedded/embedded.module#EmbeddedModule' },
  { selector: 'code-tabs', module: 'app/embedded/embedded.module#EmbeddedModule' },
  { selector: 'current-location', module: 'app/embedded/embedded.module#EmbeddedModule' },
  { selector: 'hero-form', module: 'app/embedded/embedded.module#EmbeddedModule' },
  { selector: 'app-questionnaire-host', module: 'app/questionnaire/questionnaire.module#QuestionnaireModule' },
];

export const embeddedSelectorsProvider = {
  provide: embeddedSelectorsToken,
  useValue: embeddedSelectors,
};
