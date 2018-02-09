import { Injectable } from '@angular/core';
import { Http,Headers } from "@angular/http";
import { Subject } from 'rxjs/Subject';
import { Cookie } from "ng2-cookies";
import { Template } from '../interfaces/template';
import { TemplateData } from "./mock-template";


@Injectable()
export class RestApiService {
  static login='/login';//这里加了api，需要在webpack上面替换为空
  static getUrl='/getUrl';
  private isLogin=false;
  private authorization:string;
  private _loginStateSource=new Subject();//subject是Rxjs特殊的observable对象，可共享一个执行环境
  LoginState$=this._loginStateSource.asObservable();//asObservable用来接收Subject的每次更新
  private response_type:string='token';
  private client_id:string='woHuxyCSfd8EnfUW6Ioi06Y1RT0oVFDvx6xE6x8L';
  private redirect_uri:string='http://localhost:9800/granted/';

  constructor(
    private http:Http,
  ) { }
  /**
   * 获取头信息
   */
  getHeaders (is_Sunbmit=false){
    const headers= new Headers({'Accept': 'application/json'});
    if(is_Sunbmit){
      //X-CSRFToken
      headers.append('Authorization',Cookie.get('authorization'));
      headers.append('Content-Type','application/json');
    }
    return headers;
  }
  /**
   * 登录
   * @param redirect 下一页面
   */
  doOauthLogin():void{
    const params='response_type='+this.response_type+'&client_id='+this.client_id+'&redirect_uri='+this.redirect_uri
    const url='https://api.renjinggai.com:7443/o/authorize?'+params;//const常数不能被更新
    console.log('接下来的地址：'+url);
    window.location.href=url;
  }
  /**
   * 退出
   */
  doLoginOut():void{
    const url=RestApiService.login+'/api-oauth/logout/';
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
    const header=this.getHeaders(true);
    const url='http://api-dev.renjinggai.com:10080/product/factory_information/';
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
  async doCheckLogin(){
    const url='http://api-dev.renjinggai.com:10080/product/factory_information/';
    //const url=RestApiService.getUrl+'/factory_information/';
    const header=this.getHeaders();
    await this.http.get(url,{headers:header}).toPromise()
    .then(response=>{
      //this.authorization = Cookie.get('authorization');
      this._loginStateSource.next(true);
    }).catch(err=>{
      console.log(err);
      if(err.status===403){
        this._loginStateSource.next(false);
      }
      console.log('跳转之前的地址：'+window.location.href)
      //失败跳转登录页面
      this.doOauthLogin();
    })
  }
  /**
   * 获取单个数据
   * @param id 
   */
  getItem(id:string):Promise<Template>{
    const header=this.getHeaders(true);
    const url='http://api-dev.renjinggai.com:10080/product/factory_information/'+id+'/';
    return this.http.get(url,{headers:header}).toPromise()
    .then(respone=>respone.json())
    .catch(err=>{
      return Promise.reject(err)
    });
  }
  getStaticList():Promise<Template[]>{
    return Promise.resolve(TemplateData);
    //return TemplateData;
  }
  
}
