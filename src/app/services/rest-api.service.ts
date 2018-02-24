import { Injectable } from '@angular/core';
import { Http,Headers } from "@angular/http";
import { Subject } from 'rxjs/Subject';
import { Cookie } from "ng2-cookies";
import { Template } from '../interfaces/template';
import { TemplateData } from "./mock-template";
import { Router } from '@angular/router';
import { OrgTemplate } from '../interfaces/orgTemplate';


@Injectable()
export class RestApiService {
  static login='/login';//这里加了api，需要在webpack上面替换为空
  static getUrl='/getUrl';
  private response_type:string='token';
  private client_id:string='woHuxyCSfd8EnfUW6Ioi06Y1RT0oVFDvx6xE6x8L';
  redirect_uri:string='http://localhost:9800/granted/';
  isLoggedIn = false;

  constructor(
    private http:Http,
    private router:Router
  ) { }
  /**
   * 获取头信息
   */
  getHeaders (is_Sunbmit=false){
    const headers= new Headers({'Accept': 'application/json'});
    if(is_Sunbmit){
      //X-CSRFToken
      headers.append('Authorization','Bearer '+Cookie.get('authorization'));
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
    console.log('退出了');
    this.isLoggedIn = false;
    this.router.navigate(['',]);
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
    const header=this.getHeaders(true);
    await this.http.get(url,{headers:header}).toPromise()
    .then(response=>{
      //已经登录
      console.log('登录了');
      //console.log('Cookie:'+Cookie.get('authorization'));
      this.isLoggedIn = true;
      this.router.navigate(['granted',]);
    }).catch(err=>{
      console.log(err);
      //失败跳转登录页面
      this.doOauthLogin();
    });
  }
  /**
   * 获取设备信息，返回Promise对象
   * @param id 
   */
  getItem(id:string):Promise<Template>{
    const header=this.getHeaders(true);
    const url='http://api-dev.renjinggai.com:10080/product/factory_information/'+id+'/';
    //生产信息
    return this.http.get(url,{headers:header}).toPromise()
    .then(respone=>respone.json())
    .catch(err=>{
      return Promise.reject(err);
    });
  }
  /**
   * 获取设备关联，返回Promise对象
   * @param id 
   */
  getOrg(id:string):Promise<OrgTemplate>{
    const header=this.getHeaders(true);
    const url='http://api-dev.renjinggai.com:10081/global-query/query_serial_no/'+id+'/';
    //组织信息
    return this.http.get(url,{headers:header}).toPromise()
    .then(res=>res.json())
    .catch(err=>{
      return Promise.reject(err);
    });
  }
  getStaticList():Promise<Template[]>{
    return Promise.resolve(TemplateData);
    //return TemplateData;
  }
  async save(data:Template[]):Promise<boolean>{
    let isSuccess=[];
    const header=this.getHeaders(true);
    let id='';
    //逐条保存
    await data.forEach(element => {
      id=element.serial_number;
      let url='http://api-dev.renjinggai.com:10080/product/factory_information/';
      //判断是否属于新增
      if(element.status==='new'){
        console.log('post成功把所有状态改为old');
        this.http.post(url,JSON.stringify(element),{headers:header})
        .toPromise()
        .then(()=>{
          element.status='old';
          console.log('post成功返回信息为：'+element);
        }).catch(err=>{
          isSuccess.push('0');
          console.log(Promise.reject(err));
        });
      }else{
        console.log('put');
        url='http://api-dev.renjinggai.com:10080/product/factory_information/'+ id +'/';
        this.http.put(url,JSON.stringify(element),{headers:header})
        .toPromise()
        .then(()=>element)
        .catch(err=>{
          isSuccess.push('0');
          console.log(Promise.reject(err));
        });
      }
    });
    console.log('是否保存成功：'+isSuccess.find(element=>element=='0'));
    if(isSuccess.length>0){
      console.log('保存失败');
      return false;
    }else{
      console.log('保存成功');
      return true;
    }
  }
  private handleError(error:any):Promise<any>{
    console.log('an error occurred：',error);
    return Promise.reject(error.message||error);
  }
  /**
   * 删除
   */
  del(data:Template[]):boolean{
    let isSuccess=[];
    let url='';
    const header=this.getHeaders(true);
    data.forEach(element => {
      //为new的不用删除
      let status=element.status==='new' ? true : false;
      if(!status){
        url='http://api-dev.renjinggai.com:10080/product/factory_information/'+ element.serial_number +'/';
        this.http.delete(url,{headers:header})
        .toPromise()
        .then()
        .catch(err=>{
          isSuccess.push('0');
          console.log(Promise.reject(err));
        });
      }
    });
    if(isSuccess.length>0){
      console.log('删除失败');
      return false;
    }else{
      console.log('删除成功');
      return true;
    }
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
  //日期转string
  toYYYYMMDD(date) {
    console.log('日期的类型：'+typeof(date)+'+date:'+date);
    if(date==='')return '';
    var d = typeof(date)=='string'?new Date(date):new Date(date.getTime());
    var dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate().toString();
    var mm = (d.getMonth()+1)< 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1).toString();
    var yyyy = d.getFullYear().toString(); //2011
    return yyyy+'-'+mm+'-'+dd;
  }
}
