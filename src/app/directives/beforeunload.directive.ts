import { Directive,HostListener } from '@angular/core';
import { ConfirmDialog } from '../components/dialog/confirmdialog.component';
import { MatDialog } from '@angular/material';

@Directive({
  selector: '[appBeforeunload]'
})
export class BeforeunloadDirective {
  
  constructor(public dialog:MatDialog) { }
  @HostListener('load') onload(){
    alert(1);
  }
  @HostListener('beforeunload') onbeforeunload(){
    let dialog=this.dialog.open(ConfirmDialog,{
      width:'340px',
      height:'200px',
    });
    debugger;
    //alert(1);
  }
  
}
