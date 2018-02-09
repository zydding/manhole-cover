import { OnDestroy,OnInit, Component,Directive,ElementRef,HostListener,Input, Inject } from '@angular/core';
import { RestApiService } from './services/rest-api.service'
import { Subscription } from 'rxjs/Subscription';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef } from '@angular/material';
import { Template } from './interfaces/template';
import { ConfirmDialog } from './components/dialog/confirmdialog.component';
import { Cookie } from "ng2-cookies";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent implements OnInit,OnDestroy {
  login_state:Subscription;//Subscription可以调用unsubscribe方法，销毁Observable可观察对象
  isCheck=false;
  staticList:Template[];
  isEnd:boolean=false;
  list:Template[];
  boxValue;
  //public beforeUrl=document.referrer;

  constructor(
    private restApi:RestApiService,
    public dialog : MatDialog,
    private confirmDialog:ConfirmDialog,
  ) { }
  /**
   * 页面销毁
   */
  ngOnDestroy():void{
    this.login_state.unsubscribe();
    //window.localStorage.clear();
  }
  /**
   * 页面初始化
   */
  ngOnInit():void{
    //var href=window.location.href;
    var token = this.getQueryString('access_token');
    // var token = window.location.href.replace(/^.+?access_token\=/, '');
    //let token = this.route.snapshot.queryParams["access_token"];
    localStorage.setItem('token',token);
    var a=localStorage.getItem('token').toString();
    if(a=='undefined' || a==''){
      this.restApi.doCheckLogin();
    }else{
      this.getStaticList();
      //加上头信息
      Cookie.set('authorization','Bearer '+token);
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
  // this.restApi.doCheckLogin();//验证登录
  /**
   * 通过输入框的值获取服务器的数据
   * 
   * 服务器通过webpack代理方式通过cookie验证访问
   * @param boxValue 输入框的值
   */
  async getList(boxValue:string){
    await this.restApi.getList(boxValue).then(res=>{
      for(var i=0;i<res.length;i++){
        this.staticList.push(res[i]);
      }
    });
    //this.staticList.push(this.list[0]);
  }
  /**
   * 获取单个数据
   * @param boxValue 扫码
   */
  getItem(boxValue:string){
    if(boxValue.length>0){
      this.restApi.getItem(boxValue).then(res=>{
        this.staticList.push(res);
        console.log(res);
      }).catch(err=>{
        console.log('aaa'+err);
        if(err.status===404){
          //添加数据
          this.staticList.push({
            id:0,
            serial_number:boxValue,
            batch:'',
            model:'',
            production_date:new Date(),
            deliver_date:new Date(),
            relevancy_party:'',
            batch_comment:'',
          });
          this.boxValue='';
        }
      });
    }
  }
  getStaticList():void{
    //return this.restApi.getStaticList();
    this.restApi.getStaticList().then(data=>this.staticList=data);
  }
  /**
   * 修改,打开对话框
   * @param item 数据对象
   */
  merge(item):void{
    let dialogRef=this.dialog.open(DialogComponent,{
      minWidth:'660px',
      data:{item},
      // disableClose:true,
    });

    dialogRef.afterClosed().subscribe(result=>{
      console.log(result);
    })
  }
  /**
   * 移除
   */
  remove(key):void{
    let dialogRef=this.dialog.open(ConfirmDialog,{
      width:'340px',
      height:'200px',
      
    });
    //接收mat-dialog-close传值，为true删除
    dialogRef.afterClosed().subscribe(result=>{
      if(result==true){
        //执行删除list对象，（key：列表序号，1：删除1个）
        this.staticList.splice(key,1);
      }
    })
  }
  /**
   * 全选
   * @param check 是否选中
   */
  onChangeCheckBox(check):void{
    if(check==true){
      this.isCheck=true;
    }else{
      this.isCheck=false;
    }
  }

  logout(){
    // this.router.navigateByUrl("login");
    //this.restApi.doLoginOut();
  }
  /**
   * @param boxValue 扫码
   * @param  
   */
  Saoma(boxValue,$enent){
    //debugger;
    //取得最后的字符串
    // var arrayList=boxValue.split('/');
    // boxValue=arrayList[arrayList.length-1];
    // var index=0;//输入次数
    // var d=new Date();
    // var curTime = d.getTime();
    // var twoKeyTime;
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
/**
 * 弹出框组件
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './components/dialog/dialog.component.html',
})
export class DialogComponent implements OnInit {
  //styleUrls: ['./dialog.component.css']

  //数据
  itemData:any[]=this.data.item;
  //状态
  selected = 'option2';
  //批次
  selectBatch='option1';
  //公司
  selectCompany='option1';
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef :MatDialogRef<DialogComponent>,
  ){}
  //关闭对话框
  onNoClick():void{
    this.dialogRef.close('保存');
  }

  ngOnInit() { }
}