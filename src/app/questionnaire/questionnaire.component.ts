import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AnswerService } from 'app/questionnaire/answer.service';
import { QuestionBase } from './controls/question-base';
import { QuestionControlService } from './controls/question-control.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html'
})
export class QuestionnaireComponent implements OnInit {

  @Input() questions: QuestionBase[] = [];
  form: FormGroup;

  constructor(
    private qcs: QuestionControlService,
    private answerService: AnswerService) {  }

  ngOnInit() {
    const answers = this.answerService.getAnswers();
    this.form = this.qcs.toFormGroup(this.questions, answers);
  }

  onSubmit() {
    this.answerService.saveAnswers(this.form.value);
  }
}
