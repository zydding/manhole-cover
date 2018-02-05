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

   
import { FormsModule } from "@angular/forms";

import { HttpModule } from "@angular/http";

import { AppComponent } from './app.component';
import { RestApiService } from "./services/rest-api.service";
import { CookieService } from "ng2-cookies";
import { DialogComponent } from './components/dialog/dialog.component';
import { ConfirmDialog } from './components/dialog/confirmdialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    ConfirmDialog,
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
  providers: [RestApiService,CookieService,DialogComponent,ConfirmDialog],
  entryComponents:[DialogComponent,ConfirmDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
