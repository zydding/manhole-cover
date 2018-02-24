import { NgModule } from "@angular/core";
import { RouterModule,Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { PageNotFoundComponent } from "./NotFound.component";
import { HomeComponent } from "./components/home/home.component";
import { CanAuthGuard } from "./auth-guard.service";

const routes:Routes=[
    {path:'',component:AppComponent},
    {path:'granted',component:HomeComponent,canActivate:[CanAuthGuard]},
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