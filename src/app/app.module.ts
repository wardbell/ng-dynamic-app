import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { DocViewerComponent } from 'app/docviewer/docviewer.component';
import { EmbeddedModule } from 'app/embedded/embedded.module';
import { DocumentService } from 'app/shared/document.service';
import { LocationService } from 'app/shared/location.service';
import { ScrollService } from 'app/shared/scroll.service';

import { QuestionnaireModule } from 'app/questionnaire/questionnaire.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DocViewerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    EmbeddedModule,
    HttpClientModule,
    QuestionnaireModule
  ],
  providers: [
    DocumentService,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    LocationService,
    ScrollService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
