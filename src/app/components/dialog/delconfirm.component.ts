import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delconfirm',
  template:`<h1 mat-dialog-title>信息</h1>
    <mat-dialog-content><p>你确定删除吗？</p></mat-dialog-content>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">确定</button>
      <button mat-button mat-dialog-close cdkFocusInitial>取消</button>
    </div>`,
})
export class DelconfirmComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
