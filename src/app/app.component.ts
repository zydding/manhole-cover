import { OnInit, Component,Directive,ElementRef,HostListener,Input, Inject } from '@angular/core';
import { RestApiService } from './services/rest-api.service'
import { Subscription } from 'rxjs/Subscription';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef } from '@angular/material';
import { Template } from './interfaces/template';
import { ConfirmDialog } from './components/dialog/confirmdialog.component';
import { Cookie } from "ng2-cookies";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent implements OnInit {

  constructor(
    private restApi:RestApiService,
    private router:Router
  ) { }
  /**
   * 页面初始化
   * 验证登录
   * 
   */
  ngOnInit():void{
    //初始化把cookie清空
    //Cookie.deleteAll();
    //取token并保存
    let token = this.getQueryString('access_token');
    debugger;
    if(token!='undefined' && token!=''){
      localStorage.setItem('token',token);
      let localToken=localStorage.getItem('token');
      //在已经登录后.在cookie加上头信息，用来测试取数据
      if(localToken!='underfined' && token!=''){
        Cookie.set('authorization',token);
      }
    }
    //验证登录，如果已经登录则
    this.restApi.doCheckLogin();
  }
  /**
   * 正则获取参数
   * @param name 传入需要获取的参数=前面的参数名
   */
  getQueryString(name){
    var reg = new RegExp("(^|#)"+ name +"=([^&]*)(&|$)");  
    var r = window.location.hash.substr(1).match(reg);  
    if (r!=null) return r[2]; return '';  
  }
  
}