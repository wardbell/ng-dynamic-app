import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

/**
 * Get answer(s) to a questionnaire
 * This version always returns the same answers to the same questions
 */
@Injectable()
export class AnswerService {

  constructor(private snackbar: MatSnackBar) { }

  // Todo: get async from a remote source of answers for a given questionnaire
  getAnswers() {

    return {
      firstName: 'Bombasto',
      brave: 'unproven'
    };
  }

  saveAnswers(answers: {}) {
    console.log('Questionnaire answers saved', answers);
    this.snackbar.open(
      `Questionnaire answers saved ${JSON.stringify(answers)}`,
      '',
       { duration: 3000 }
    );
  }
}
