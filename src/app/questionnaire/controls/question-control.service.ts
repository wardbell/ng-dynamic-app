import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from './question-base';

@Injectable()
export class QuestionControlService {
  toFormGroup(questions: QuestionBase[], answers: {} = {} ) {
    const group: any = {};

    questions.forEach(question => {
      const key = question.key;
      group[key] = !!question.required ?
        new FormControl(answers[key] || '', Validators.required) :
        new FormControl(answers[key] || '');
    });
    return new FormGroup(group);
  }
}
