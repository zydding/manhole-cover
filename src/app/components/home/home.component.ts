import { Component, OnInit,Inject } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { Template } from '../../interfaces/template';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef } from '@angular/material';
import { ConfirmDialog } from '../dialog/confirmdialog.component';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { forEach } from '@angular/router/src/utils/collection';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit,OnDestroy {
  staticList:Template[]=[];
  isCheck=false;
  isEnd:boolean=false;
  dirtyList:any[]=[];
  Invalue;
  //boxValue;
  //[(ngModel)]="boxValue"
  constructor(
    private restApi:RestApiService,
    private dialog:MatDialog,
    private confirmDialog:ConfirmDialog,
    private router:Router,
  ) { }
  ngOnDestroy(){ }
  ngOnInit() {
    this.getStaticList();
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
        console.log('服务器错误信息：'+err);
        console.log('Cookie:'+Cookie.get('authorization'));
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
      console.log('result'+result);
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
  async Saoma(boxValue,$enent){
    //判断，只有在字符串匹配时才去取取数据
    //取得最后的字符串
    var arrayList=boxValue.split('/');
    boxValue=arrayList[arrayList.length-1];
    //这里是扫码
    console.log('输入了：'+boxValue);
    await this.dirtyList.push(boxValue);
    boxValue=this.dirtyList.pop();//取最后一项
    console.log('这是list：'+this.dirtyList.toString()+'即将添加'+boxValue);
    //需要先处理字符串
    var arrayA:any[]=[];
    arrayA=this.dealArray(boxValue);
    if(arrayA.length>0){
      var value='';
      arrayA.forEach(element => {
        value=element.value;
        if(value){
          return;
        }
      });
      this.getItem(value);
      this.Invalue='';//清空
    }else{
      console.log('没有找到匹配格式');
      //this.Invalue='';//清空
    }
    this.dirtyList.splice(0,this.dirtyList.length);//删除全部
  }
  /** 
   * 处理BoxValue的格式
   * 期望：判断是否满足三种字符串格式，是返回true，否false
  */
  dealArray(boxValue):any[]{
    var flag=false;
    console.log('字符总长度：'+boxValue);
    var patter1=/EC2-\d{12}/g;//匹配EC2
    var patter2=/CL\d{12}/g;//匹配CL
    var patter3=/\d{12}/g;//匹配12数字
    var arrayA=[];
    //返回包含该查找结果的一个数组。 
    var arr1,arr2,arr3;
    if((arr1=patter1.exec(boxValue))!=null){
      flag=true;
      console.log('找到了EC2-');
      arrayA.push({value:arr1[0],flag:flag});
    }
    if((arr2=patter2.exec(boxValue))!=null && flag===false){
      flag=true;
      console.log('找到了CL');
      arrayA.push({value:arr2[0],flag:flag});
    }
    if((arr3=patter3.exec(boxValue))!=null && flag===false){
      flag=true;
      console.log('找到了Num');
      arrayA.push({value:arr3[0],flag:flag});
    }
    return arrayA;
  }
  //退出
  logout(){
    // this.router.navigateByUrl("/");
    // Cookie.deleteAll();
    // window.location.reload();
    this.restApi.doLoginOut();
  }
  
}
/**
 * 弹出框组件
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent implements OnInit {
  //styleUrls: ['./dialog.component.css']

  //数据
  itemData=this.data.item;
  
  selectedBatch:string=this.itemData.batch;
  staticList=[];
  BatchList=[
    {value:'DT20180201'},
    {value:'DT20180202'},
  ]
  
  //批次
  selectBatch='option1';
  //型号
  selectModel="option1";
  //公司
  selectCompany='option1';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef :MatDialogRef<DialogComponent>,
  ){}
  //关闭对话框
  onNoClick():void{
    console.log(this.selectedBatch);
    this.staticList.push({
      batch:'',
      model:'',
      production_date:new Date(),
      deliver_date:new Date(),
      relevancy_party:'',
      batch_comment:'',
    });
    this.dialogRef.close('保存');
  }
  ngOnInit() { }
}
