import { Component, OnInit,Inject } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { Template } from '../../interfaces/template';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef } from '@angular/material';
import { ConfirmDialog } from '../dialog/confirmdialog.component';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { forEach } from '@angular/router/src/utils/collection';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

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
    this.Invalue='CL201709060000';
    //this.getStaticList();
  }
  /**
   * 获取单个数据
   * 判断不能重复
   * @param boxValue 处理后的字符串
   */
  getItem(boxValue:string){
    //var arrayList=boxValue.split('/');
    //boxValue=arrayList[arrayList.length-1];
    if(boxValue.length>0){
      this.restApi.getItem(boxValue).then(res=>{
        const isHas=this.checkIsHas(boxValue);//判断是否重复
        if(!isHas){
          if(res){
            //设备关联信息
            this.restApi.getOrg(boxValue).then(response=>{
              //合并设备信息
              res.relevancy_party=response.org_name;
            }).catch(err=>{
              console.log('错误信息：没有取到设备关联信息');
            });
          }
          this.staticList.push(res);
        }
        else{
          //alert('序列号重复了，请确认！');
          console.log('序列号重复了，请确认！');
        }
        //this.boxValue='';
      }).catch(err=>{
        //console.log('Cookie:'+Cookie.get('authorization'));
        if(err.status===404){
          const isHas=this.checkIsHas(boxValue);//判断是否重复
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
   * @param index 数据下标
   */
  merge(item,index):void{
    let dialogRef=this.dialog.open(DialogComponent,{
      minWidth:'660px',
      data:{item},
      // disableClose:true,
    });

    dialogRef.afterClosed().subscribe(result=>{
      //执行保存
      //替换当前item的数据staticList
      this.staticList.splice(index,1,result);//删除一个并替换了
    });
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
    //console.log('输入了：'+boxValue);
    await this.dirtyList.push(boxValue);
    boxValue=this.dirtyList.pop();//取最后一项
    //console.log('这是list：'+this.dirtyList.toString()+'即将添加'+boxValue);
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
      //console.log('没有找到匹配格式');
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
    //console.log('字符总长度：'+boxValue);
    var patter1=/EC2-\d{12}/g;//匹配EC2
    var patter2=/CL\d{12}/g;//匹配CL
    var patter3=/\d{12}/g;//匹配12数字
    var arrayA=[];
    //返回包含该查找结果的一个数组。 
    var arr1,arr2,arr3;
    if((arr1=patter1.exec(boxValue))!=null){
      flag=true;
      //console.log('找到了EC2-');
      arrayA.push({value:arr1[0],flag:flag});
    }
    if((arr2=patter2.exec(boxValue))!=null && flag===false){
      flag=true;
      //console.log('找到了CL');
      arrayA.push({value:arr2[0],flag:flag});
    }
    if((arr3=patter3.exec(boxValue))!=null && flag===false){
      flag=true;
      //console.log('找到了Num');
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
  //数据
  itemData=this.data.item;
  
  //批次
  selectBatch=this.itemData.batch;
  //型号
  selectedModel:string=this.itemData.model;
  myControl: FormControl = new FormControl();
  ModelList=[
    'DT20180201',
    'DT20180202',
    'EC2-D600',
  ];
  filteredOptions: Observable<string[]>;

  //生产日期
  production_date= this.itemData.production_date;
  //发货日期
  deliver_date=this.itemData.deliver_date;
  //关联厂家
  relevancy_party=this.itemData.relevancy_party;
  //备注
  batch_comment=this.itemData.batch_comment;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef :MatDialogRef<DialogComponent>,
  ){}
  //关闭对话框
  onNoClick():void{
    let staticList:Template={
      serial_number:this.itemData.serial_number,
      batch:this.selectBatch,
      model:this.selectedModel,
      production_date:this.production_date,
      deliver_date:this.deliver_date,
      relevancy_party:this.relevancy_party,
      batch_comment:this.batch_comment,
    };
    this.dialogRef.close(staticList);
  }

  ngOnInit() { 
    this.filteredOptions=this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(val=>this.filter(val)),
    );
  }
  //过滤
  filter(val:string):string[]{
    return this.ModelList.filter(res=>
    res.toLowerCase().indexOf(val.toLowerCase())===0);
  }
}
