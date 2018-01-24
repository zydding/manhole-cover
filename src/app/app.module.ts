import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material";
import { HttpModule } from "@angular/http";

import { AppComponent } from './app.component';
import { RestApiService } from "./services/rest-api.service";
import { CookieService } from "ng2-cookies";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpModule,
  ],
  providers: [RestApiService,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
