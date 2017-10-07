/**
 * Demonstrates injecting an application level service into an embedded component
 */

import { Component } from '@angular/core';
import { LocationService } from 'app/shared/location.service';

/**
 * Displays the current location path
 */
@Component({
  /* tslint:disable component-selector */
  selector: 'current-location',
  template: '{{ location.currentPath | async }}'
})
export class CurrentLocationComponent {
  constructor(public location: LocationService) {
  }
}
