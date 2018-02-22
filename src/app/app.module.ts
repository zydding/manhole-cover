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
} from "@angular/material";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent, } from './app.component';

import { RestApiService } from "./services/rest-api.service";
import { CookieService } from "ng2-cookies";
import { ConfirmDialog } from './components/dialog/confirmdialog.component';
import { HomeComponent,DialogComponent } from './components/home/home.component';
import { AppRoutingModule } from './app.routing';
import { PageNotFoundComponent } from './NotFound.component';
import { RouterModule } from '@angular/router';
import { CanAuthGuard } from './auth-guard.service';
import { BeforeunloadDirective } from './directives/beforeunload.directive';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialog,
    DialogComponent,
    HomeComponent,
    PageNotFoundComponent,
    BeforeunloadDirective,
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
    CanAuthGuard,
  ],
  entryComponents:[ConfirmDialog,DialogComponent],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
