import { Injectable } from '@angular/core';
import { Http,Headers } from "@angular/http";
import { Subject } from 'rxjs/Subject';
import { Cookie } from "ng2-cookies";


import { Template } from '../interfaces/template';

@Injectable()
export class RestApiService {
  static host='/api';//这里加了api，需要在webpack上面替换为空
  private isLogin=false;
  private csrfToken:string;
  private _loginStateSource=new Subject();//subject是Rxjs特殊的observable对象，可共享一个执行环境
  LoginState$=this._loginStateSource.asObservable();//asObservable用来接收Subject的每次更新

  constructor(private http:Http) { }
  /**
   * 获取头信息
   */
  getHeaders (is_Sunbmit=false){
    const headers= new Headers({'Accept': 'application/json'});
    if(is_Sunbmit){
      headers.append('X-CSRFToken',this.csrfToken);
      headers.append('Content-Type','application/json');
    }
    return headers;
  }
  /**
   * 登录
   * @param redirect 下一页面
   */
  doOauthLogin(redirect:string):void{
    const url=RestApiService.host+'/api-auth/login/?next='+redirect;//const常数不能被更新
    window.location.href=url;
  }
  /**
   * 退出
   */
  doLoginOut():void{
    const url=RestApiService.host+'/api-oauth/logout/';
    console.log('退出地址:'+url);
    this.http.get(url)
    .toPromise().then(response=>{
      console.log(response);
      this._loginStateSource.next(false);
    });
  }

  /**
   * 通过输入框的值获取服务器的数据
   * @param boxValue 输入框的值
   */
  getList(boxValue):Promise<Template[]>{
    const header=this.getHeaders();
    const url=RestApiService.host+'/batch-info/';
    return this.http.get(url,{headers:header}).toPromise()
    .then(respone=>respone.json())
    .catch(err=>{
      console.log(err);
      return Promise.reject(err);
    });
  }
  /**
   * 验证登录
   */
  async doCheckLogin(boxValue){
    await this.getList(boxValue).then(response=>{
      const url = RestApiService.host + '/batch-info/';
      this.csrfToken = Cookie.get('csrftoken');
      this._loginStateSource.next(true);
    }).catch(err=>{
      if(err.status===403){
        this._loginStateSource.next(false);
      }
      //失败跳转登录页面
      this.doOauthLogin('/batch-info/');
    })
  }
  /**
   * 获取单个数据
   * @param id 
   */
  getItem(id:number):Promise<Template>{
    const header=this.getHeaders();
    const url=RestApiService.host+'/batch-info/'+id+'/';
    return this.http.get(url,{headers:header}).toPromise()
    .then(respone=>respone.json())
    .catch(err=>{
      console.log(err);
      return Promise.reject(err);
    });
  }
}
