import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { 
  MatButtonModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatSelectModule,
  MatDialogModule,
  
   } from "@angular/material";

import { DialogComponent } from './components/dialog/dialog.component';

import { FormsModule } from "@angular/forms";

import { HttpModule } from "@angular/http";

import { AppComponent } from './app.component';
import { RestApiService } from "./services/rest-api.service";
import { CookieService } from "ng2-cookies";

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
  ],
  providers: [RestApiService,CookieService,DialogComponent],
  entryComponents:[DialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
