import { OnDestroy,OnInit, Component,Directive,ElementRef,HostListener,Input, Inject } from '@angular/core';
import { RestApiService } from './services/rest-api.service'
import { Subscription } from 'rxjs/Subscription';
import { Template } from './interfaces/template';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './components/dialog/dialog.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent implements OnInit,OnDestroy {
  login_state:Subscription;//Subscription可以调用unsubscribe方法，销毁Observable可观察对象
  heroes=[];//用来存页面行号的列表
  flag:boolean;
  boxValue='';
  keyUpTime;
  name='zengyi';
  animal='大象';
  constructor(private restApi:RestApiService,
    public dialog : MatDialog,
  private dialogComponent:DialogComponent) {
  }
  /**
   * 页面销毁？
   */
  ngOnDestroy():void{
    this.login_state.unsubscribe();
  }
  /**
   * 页面初始化
   */
  ngOnInit():void{
    this.flag=false;
  }
  /**
   * 打开弹出框
   */
  OpenDialog():void{
    var that=this;
    let dialogRef=this.dialog.open(DialogComponent,{
      width:'600px',
      data:{name:that.name,animal:that.animal}
    });

    dialogRef.afterClosed().subscribe(result=>{
      console.log('close');
      this.animal=result;
    })
  }
  /**
   * 通过输入框的值获取服务器的数据
   * 
   * 服务器通过webpack代理方式通过cookie验证访问
   * @param boxValue 输入框的值
   */
  getList(boxValue:string):Promise<Template[]>{
    this.restApi.doCheckLogin(boxValue);//验证登录
    return null;
  }
  Saoma(boxValue,$enent){
    //debugger;
    //取得最后的字符串
    // var arrayList=boxValue.split('/');
    // boxValue=arrayList[arrayList.length-1];
    // var index=0;//输入次数
    // var d=new Date();
    // var curTime = d.getTime();
    // var twoKeyTime;
    // if(this.keyUpTime !== '' && this.keyUpTime !== NaN){
    //   twoKeyTime = curTime - this.keyUpTime;
    //   if(twoKeyTime >=1000 || twoKeyTime==0){
    //     //这里是用户输入
    //     var type=typeof(boxValue);
    //     if(type!='undefined'&& boxValue!=''){
    //         //判断重复
    //         this.boxValue=boxValue;
    //         this.heroes.push(boxValue);
    //     }
    //   }
    // }
    //this.keyUpTime = curTime;
    // var d=new Date();
    // var curTime = d.getTime();
    // var twoKeyTime;
    // if(this.keyUpTime !== '' && this.keyUpTime !== NaN){
    //   twoKeyTime = curTime - this.keyUpTime;
    //   if(twoKeyTime >=70){
    //     //这里是用户输入
    //     alert('用户不能输入！');
    //   }
    //   else{
    //     //这里是扫码
    //     var type=typeof(boxValue);
    //     if(type!='undefined'&& boxValue!=''){
    //         //判断重复
    //         this.boxValue=boxValue;
    //         this.heroes.push(boxValue);
    //     }
    //   }
    // }
    // this.keyUpTime = curTime;
  }
  
}

