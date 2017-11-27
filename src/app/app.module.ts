import { NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ROUTES } from '@angular/router';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { embeddedSelectorsProvider } from 'app/shared/embedded-selectors';
import { DocViewerComponent } from 'app/docviewer/docviewer.component';
import { DocumentService } from 'app/shared/document.service';
import { LocationService } from 'app/shared/location.service';
import { ScrollService } from 'app/shared/scroll.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DocViewerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    embeddedSelectorsProvider,
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    {
      // This is currently the only way to get `@angular/cli`
      // to split `EmbeddedModule` into a separate chunk :(
      provide: ROUTES,
      useValue: [
        { path: '/embedded', loadChildren: 'app/embedded/embedded.module#EmbeddedModule' },
        { path: '/questionnaire', loadChildren: 'app/questionnaire/questionnaire.module#QuestionnaireModule' }
      ],
      multi: true
    },
    DocumentService,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    LocationService,
    ScrollService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
