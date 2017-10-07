/**
 * Demonstrates injecting an embedded service into an embedded component
 */

import { Component, OnInit } from '@angular/core';
import { FortuneCookieService } from 'app/embedded/fortune-cookie/fortune-cookie.service';

@Component({
  /* tslint:disable component-selector */
  selector: 'fortune',
  template: '{{fortune}}'
})
export class FortuneCookieComponent implements OnInit {
  fortune: string;
  constructor(private fortuneService: FortuneCookieService) {}

  ngOnInit() {
    this.fortune = this.fortuneService.getFortune();
  }
}
