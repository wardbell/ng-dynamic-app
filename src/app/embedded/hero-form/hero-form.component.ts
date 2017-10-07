import { Component } from '@angular/core';

import { Hero } from './hero';

@Component({
  /* tslint:disable component-selector */
  selector: 'hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls:  ['./hero-form.component.css']
})
export class HeroFormComponent {

  powers = ['Really Smart', 'Super Flexible',
            'Super Hot', 'Weather Changer'];

  model = new Hero(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');

  submitted = false;

  onSubmit() { this.submitted = true; }

  newHero() {
    this.model = new Hero(42, '', '');
  }

}
