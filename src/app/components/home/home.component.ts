import { Component, OnInit,Inject } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { Template } from '../../interfaces/template';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef } from '@angular/material';
import { ConfirmDialog } from '../dialog/confirmdialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  staticList:Template[]=[];
  isCheck=false;
  isEnd:boolean=false;
  dirtyList:any[]=[];
  //boxValue;
  //[(ngModel)]="boxValue"
  keyUpTime;

  constructor(
    private restApi:RestApiService,
    private dialog:MatDialog,
    private confirmDialog:ConfirmDialog,
    private router:Router,
  ) { }

  ngOnInit() {
  }
  /**
   * 获取单个数据
   * 判断不能重复
   * @param boxValue 扫码
   */
  getItem(boxValue:string){
    //var arrayList=boxValue.split('/');
    //boxValue=arrayList[arrayList.length-1];
    if(boxValue.length>0){
      this.restApi.getItem(boxValue).then(res=>{
        var isHas=this.checkIsHas(boxValue);//判断是否重复
        if(!isHas){
          this.staticList.push(res);
        }
        else{
          //alert('序列号重复了，请确认！');
          console.log('序列号重复了，请确认！');
        }
        //this.boxValue='';
      }).catch(err=>{
        console.log('错误信息：'+err);
        if(err.status===404){
          var isHas=this.checkIsHas(boxValue);//判断是否重复
          //没重复
          if(!isHas){
            //添加数据
            this.staticList.push({
              serial_number:boxValue,
              batch:'',
              model:'',
              production_date:new Date(),
              deliver_date:new Date(),
              relevancy_party:'',
              batch_comment:'',
            });
          }else{
            //alert('序列号重复了，请确认！');
            console.log('序列号重复了，请确认！');
          }
          //this.boxValue='';
        }else{
          console.log('你的登录过期，请重新登录。');
        }
      });
    }
  }
  //验证重复
  checkIsHas(value):boolean{
    var isHas=false;
    this.staticList.forEach(element => {
      if(element.serial_number==value){
        isHas=true;
        return;
      }
    });
    return isHas;
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
  Saoma(boxValue,$enent){
    //debugger;
    //取得最后的字符串
    var arrayList=boxValue.split('/');
        boxValue=arrayList[arrayList.length-1];
    var date=new Date();
    var curTime = date.getTime();
    var twoKeyTime;
    if(this.keyUpTime !== '' && this.keyUpTime !== NaN){
      twoKeyTime = curTime - this.keyUpTime;
      if(twoKeyTime >=70){
        //这里是用户输入
        console.log('用户输入了:'+boxValue);
      }else{
        //这里是扫码
        console.log('扫码输入了：'+boxValue);
        this.dirtyList.push(boxValue);
        debugger;
        boxValue=this.dirtyList.splice(this.dirtyList.length-1,1);
        this.getItem(boxValue);
      }
    }
    this.keyUpTime = curTime;
  }
  //退出
  logout(){
    this.router.navigateByUrl("/");
    window.location.reload();
    //this.restApi.doLoginOut();
  }
  
}
/**
 * 弹出框组件
 */
@Component({
  selector: 'app-dialog',
  templateUrl: '../dialog/dialog.component.html',
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
