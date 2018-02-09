import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { 
  MatButtonModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatSelectModule,
  MatDialogModule,
  MatIconModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatInputModule,
  MatCheckboxModule,
} from "@angular/material";

import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent,DialogComponent } from './app.component';
import { RestApiService } from "./services/rest-api.service";
import { CookieService } from "ng2-cookies";
import { ConfirmDialog } from './components/dialog/confirmdialog.component';


@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialog,
    DialogComponent,
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
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    
  ],
  providers: [
    RestApiService,
    CookieService,
    ConfirmDialog,
    DialogComponent,
  ],
  entryComponents:[ConfirmDialog,DialogComponent],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
