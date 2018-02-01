import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './testdialog.html',
  
})
export class DialogComponent implements OnInit {
  //状态styleUrls: ['./dialog.component.css']
  selected = 'option2';
  //批次
  selectBatch='option1';
  //公司
  selectCompany='option1';

  value:boolean=false;
  constructor(
    ){}
    //关闭对话框
    //@Inject(MAT_DIALOG_DATA) public data:any
    //public dialogRef :MatDialogRef<DialogComponent>,
  //this.dialog.open(DialogComponent);
  onNoClick():void{
    //this.dialogRef.close(this.value);
  }

  ngOnInit() {
  }

}
