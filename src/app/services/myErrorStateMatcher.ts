import { ErrorStateMatcher } from "@angular/material";
import { NgForm, FormGroupDirective, FormControl } from "@angular/forms";

export class myErrorStateMatcher implements ErrorStateMatcher{
    isErrorState(control : FormControl | null , from : FormGroupDirective | NgForm | null):boolean{
        const isSubmitted=from &&  from.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}