import { NgModule, Inject, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatSnackBarModule } from '@angular/material';

import { QuestionnaireHostComponent } from './questionnaire-host.component';
import { QuestionnaireComponent } from './questionnaire.component';
import { QuestionComponent } from './controls/question.component';

const embeddableComponents: Type<any>[] = [
  QuestionnaireHostComponent
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  declarations: [
    embeddableComponents,
    QuestionnaireComponent,
    QuestionComponent
  ],
  // Must be an entryComponent to use as an embedded component
  entryComponents: [ embeddableComponents ]
})
export class QuestionnaireModule {
  embeddedComponents = embeddableComponents;
}
