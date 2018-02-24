import { OnInit, Component,Directive,ElementRef,HostListener,Input, Inject } from '@angular/core';
import { RestApiService } from './services/rest-api.service'
import { Subscription } from 'rxjs/Subscription';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef } from '@angular/material';
import { Template } from './interfaces/template';
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
   */
  ngOnInit():void{
    let token = this.restApi.getQueryString('access_token');
    Cookie.set('authorization',token);
    console.log('登陆前的 token为：'+token);
    //console.log('Cookie:'+Cookie.get('authorization'));
    this.restApi.doCheckLogin();
  }
}