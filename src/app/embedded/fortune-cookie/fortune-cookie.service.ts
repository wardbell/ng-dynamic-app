import { Injectable } from '@angular/core';

const fortunes = [
 'Birds of a feather stick together.',
 'A penny saved is a penny earned.',
 'What\'s love got to do with it?',
 'Don\'t let the screen door hit you on your way out!',
 'You better shop around.',
 'After burning your bridges, oh what a lovely fire.'
];

@Injectable()
export class FortuneCookieService {
  private next = -1;

  getFortune() {
    this.next += 1;
    if (this.next >= fortunes.length ) { this.next = 0; }
    return fortunes[this.next];
  }
}
