import { NgModule } from "@angular/core";
import { RouterModule,Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { PageNotFoundComponent } from "./NotFound.component";
import { HomeComponent } from "./components/home/home.component";
import { ConfirmDialog } from "./components/dialog/confirmdialog.component";

const routes:Routes=[
    {path:'granted',component:HomeComponent},
    {path:'**',component:PageNotFoundComponent},
]

@NgModule({
    imports:[
        RouterModule.forRoot(
            routes
        )
    ],
    exports:[RouterModule],
})

export class AppRoutingModule{}