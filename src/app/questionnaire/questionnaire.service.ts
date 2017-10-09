import { Injectable } from '@angular/core';

import { DropdownQuestion } from './controls/question-dropdown';
import { QuestionBase } from './controls/question-base';
import { TextboxQuestion } from './controls/question-textbox';

/**
 * Get metadata for a Questionnaire
 * This version always returns the same questionnaire metadata
 */
@Injectable()
export class QuestionnaireService {

  // Todo: get async from a remote source of question metadata
  getQuestions() {

    const questions: QuestionBase[] = [

      new DropdownQuestion({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          {key: 'solid',  value: 'Solid'},
          {key: 'great',  value: 'Great'},
          {key: 'good',   value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 3
      }),

      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        required: true,
        order: 1
      }),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2
      })
    ];

    return questions.sort((a, b) => a.order - b.order);
  }
}
