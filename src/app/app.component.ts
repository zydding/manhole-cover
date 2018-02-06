import { OnDestroy,OnInit, Component,Directive,ElementRef,HostListener,Input, Inject } from '@angular/core';
import { RestApiService } from './services/rest-api.service'
import { Subscription } from 'rxjs/Subscription';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef } from '@angular/material';
import { Template } from './interfaces/template';
import { ConfirmDialog } from './components/dialog/confirmdialog.component';



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
  staticList:Template[];
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
  }
  /**
   * 页面初始化
   */
  ngOnInit():void{
    this.flag=false;
    this.getStaticList();
  }
  /**
   * 通过输入框的值获取服务器的数据
   * 
   * 服务器通过webpack代理方式通过cookie验证访问
   * @param boxValue 输入框的值
   */
  getList(boxValue:string):void{
    this.restApi.doCheckLogin(boxValue);//验证登录
    return null;
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

  isEnd:Boolean=false;

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
    this.dialogRef.close('guanbi');
  }

  ngOnInit() {
    console.log(this.data.item);
    
  }
}