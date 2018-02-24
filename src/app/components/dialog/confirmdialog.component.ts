import { Component,OnInit } from "@angular/core";

@Component({
    selector:'comfirmdialog',
    template:`<h1 mat-dialog-title>信息</h1>
    <mat-dialog-content><p>你确定移除吗？</p></mat-dialog-content>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">确定</button>
      <button mat-button mat-dialog-close cdkFocusInitial>取消</button>
    </div>`,
})
export class ConfirmDialog implements OnInit{
    constructor(){}//构造函数
    ngOnInit(){
    }
}