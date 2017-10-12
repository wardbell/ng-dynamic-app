import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { QuestionnaireHostComponent } from './questionnaire-host.component';
import { QuestionnaireComponent } from './questionnaire.component';
import { QuestionComponent } from './controls/question.component';

import { EmbeddedComponents } from 'app/embedded/embedded.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    QuestionnaireHostComponent,
    QuestionnaireComponent,
    QuestionComponent
  ],
  // Must be an entryComponent to use as an embedded component
  entryComponents: [ QuestionnaireHostComponent ]
})
export class QuestionnaireModule {
  // add the QuestionnaireHost component to the injected EmbeddedComponents
  // so that the DocViewer creates and applies the QuestionnaireHost factory
  constructor(embeddedComponents: EmbeddedComponents) {
    embeddedComponents.components.push(QuestionnaireHostComponent);
  }
}
