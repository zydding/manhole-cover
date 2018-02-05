import { Input,Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  
})
export class DialogComponent implements OnInit {
  //状态styleUrls: ['./dialog.component.css']

  @Input() data:any[];
  selected = 'option2';
  //批次
  selectBatch='option1';
  //公司
  selectCompany='option1';

  value:boolean=false;
  constructor(
  ){}
  //关闭对话框
  // @Inject(MAT_DIALOG_DATA) public data1:any,
  // public dialogRef :MatDialogRef<DialogComponent>,
  //this.dialog.open(DialogComponent);
  onNoClick():void{
    //this.dialogRef.close(this.value);
  }

  ngOnInit() {
    console.log(this.data);
  }

}
