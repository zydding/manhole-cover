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
  MatAutocompleteModule,
  MatTableModule,
} from "@angular/material";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent, } from './app.component';

import { RestApiService } from "./services/rest-api.service";
import { CookieService } from "ng2-cookies";
import { ConfirmDialog } from './components/dialog/confirmdialog.component';
import { HomeComponent,DialogComponent } from './components/home/home.component';
import { DelconfirmComponent } from './components/dialog/delconfirm.component';

import { AppRoutingModule } from './app.routing';
import { PageNotFoundComponent } from './NotFound.component';
import { RouterModule } from '@angular/router';
import { CanAuthGuard } from './auth-guard.service';
import { BeforeunloadDirective } from './directives/beforeunload.directive';
import { SaveconfirmComponent } from './components/dialog/saveconfirm.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialog,
    DialogComponent,
    HomeComponent,
    PageNotFoundComponent,
    BeforeunloadDirective,
    DelconfirmComponent,
    SaveconfirmComponent,
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
    MatAutocompleteModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
  ],
  providers: [
    RestApiService,
    CookieService,
    ConfirmDialog,
    DialogComponent,
    DelconfirmComponent,
    SaveconfirmComponent,
    CanAuthGuard,
  ],
  entryComponents:[ConfirmDialog,DialogComponent,DelconfirmComponent,SaveconfirmComponent,],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
