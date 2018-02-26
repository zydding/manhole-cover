import { Component, OnInit,Inject } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { Template } from '../../interfaces/template';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { forEach } from '@angular/router/src/utils/collection';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { SelectionModel } from '@angular/cdk/collections';
import { element } from 'protractor';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit,OnDestroy {

  displayedColumns=['select','serial_number','batch','model','production_date','deliver_date','relevancy_party','batch_comment','handle'];
  dataSource=new MatTableDataSource<Template>([]);
  selection=new SelectionModel<Template>(true,[]);

  // isCheck=false;
  dirtyList:any[]=[];
  boxValue;
  constructor(
    private restApi:RestApiService,
    private dialog:MatDialog,
    private router:Router,
  ) { }
  ngOnDestroy(){ }
  ngOnInit() {
    this.boxValue='CL201709060000';
    // this.getStaticList();
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
          this.dataSource.data.push(res);
          this.dataSource._updateChangeSubscription();
          this.boxValue='';//清空
        }
        else{
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
            this.dataSource.data.push({
              serial_number:boxValue,
              batch:'',
              model:'',
              production_date:this.restApi.toYYYYMMDD(new Date()),
              deliver_date:this.restApi.toYYYYMMDD(new Date()),
              relevancy_party:'',
              batch_comment:'',
              status:'new'
            });
            this.dataSource._updateChangeSubscription();
            this.boxValue='';//清空
          }else{
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
    this.dataSource.data.forEach(element=>{
      if(element.serial_number==value){
        isHas=true;return;
      }
    });
    return isHas;
  }
  getStaticList(){
    //return this.restApi.getStaticList();
    this.restApi.getStaticList().then(data=>{this.dataSource.data=data;});
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
      disableClose:true,
    });

    dialogRef.afterClosed().subscribe(result=>{
      //防止result为空
      if(result){
        //替换当前item的数据staticList
        this.dataSource.data.splice(index,1,result);//删除一个并替换了
        this.dataSource._updateChangeSubscription();
        //this.save();
      }
    });
  }
  /**
   * 移除
   */
  remove(index):void{
    let info = '你确定移出吗？';
    let dialogRef=this.dialog.open(ConfirmComponent,{
      width:'340px',
      height:'200px',
      data:{info},
    });
    //接收mat-dialog-close传值，为true删除
    dialogRef.afterClosed().subscribe(result=>{
      if(result==true){
        //执行删除list对象，（key：列表序号，1：删除1个）
        this.dataSource.data.splice(index,1);
        this.selection.clear();//取消全选
        this.dataSource._updateChangeSubscription();
      }
    });
  }
  /**
   * 判断全选
   * 返回ture or false
   */
  isAllSelected(){
    const numSelected=this.selection.selected.length;
    const numRows=this.dataSource.data.length;
    return numSelected===numRows;
  }
  /**
   * 全选
   */
  masterToggle(){
    this.isAllSelected()?this.selection.clear():this.dataSource.data.forEach(row=>this.selection.select(row));
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
      
    }else{
      //console.log('没有找到匹配格式');
      //this.boxValue='';//清空
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
    this.restApi.doLoginOut();
  }
  //保存
  save(){
    let info = '你确定保存吗？';
    let dialogRef=this.dialog.open(ConfirmComponent,{
      width:'340px',
      height:'200px',
      data:{info}
    });
    //接收mat-dialog-close传值，为true删除
    dialogRef.afterClosed().subscribe(result=>{
      if(result==true){
        console.log('长度：'+this.dataSource.data.length);//5-1=4，循环5次
        for(let i=0;i<(this.dataSource.data.length);i++){
          let flage=this.restApi.save(this.dataSource.data[i]).then(res=>{
            // debugger;
            //循环到最后一次成功则成功，失败一次则失败
            if(i===(this.dataSource.data.length-1)){
              info='保存成功！';
              this.dialog.open(AlertComponent,{
                width:'340px',
                data:{info}
              });
            }
            console.log('保存成功！');
            this.dataSource.data[i].status='old';//改变状态为old
            console.log(this.dataSource.data[i]);
          }).catch(err=>{
            // debugger;
            if(err.status){
              info='保存失败！';
              this.dialog.open(AlertComponent,{
                width:'340px',
                data:{info}
              });
              console.log('保存失败！');
            }else{
              if(i===(this.dataSource.data.length-1)){
                info='保存成功！';
                this.dialog.open(AlertComponent,{
                  width:'340px',
                  data:{info}
                });
                this.dataSource.data[i].status='old';//改变状态为old
              }
            }
          });
          // debugger;
          // if(!flage){
          //   break;
          // }
        }
      }
    });
  }
  /**
   * 批量修改
   */
  mergeMore(){
    if(this.selection.selected.length>0){
      //默认编辑第一个对象，替换所有对象
      let item=this.selection.selected[0];
      //设置修改过的才替换
      let dialogRef=this.dialog.open(DialogComponent,{
        minWidth:'660px',
        data:{item},
        disableClose:true,
      });
      dialogRef.afterClosed().subscribe(result=>{
        //防止result为空
        if(result){
          let objMerge='';
          if(result.batch!=item.batch){
            objMerge='batch';
            this.mergeMoreExecute(objMerge,result);
          }
          if(result.model!=item.model){
            objMerge='model';
            this.mergeMoreExecute(objMerge,result);
          }
          if(result.deliver_date!=item.deliver_date){
            objMerge='deliver_date';
            this.mergeMoreExecute(objMerge,result);
          }
          if(result.batch_comment!=item.batch_comment){
            objMerge='batch_comment';
            this.mergeMoreExecute(objMerge,result);
          }
        }
      });
    }else{
      let info='没有选择！';
      this.dialog.open(AlertComponent,{
        width:'340px',
        data:{info}
      });
    }
  }
  /**
   * 根据修改对象，只批量改变修改前后不相同的值
   * @param objMerge 修改过的值
   * @param result 修改结果集
   */
  mergeMoreExecute(objMerge,result){
    switch(objMerge){
      case 'batch':
        this.selection.selected.forEach(ele=>{
          ele.batch=result.batch;
        });
        break;
      case 'model':
        this.selection.selected.forEach(ele=>{
          ele.model=result.model;
        });
        break;
      case 'deliver_date':
        this.selection.selected.forEach(ele=>{
          ele.deliver_date=result.deliver_date;
        });
        break;
      case 'batch_comment':
        this.selection.selected.forEach(ele=>{
          ele.batch_comment=result.batch_comment;
        });
        break;
      default:
        console.log('批量修改出错');
    }
    
  }
  /**
   * 删除
   */
  del(){
    let info = '你确定删除吗？';
    if(this.selection.selected.length>0){
      //调用删除方法
      let dialogRef=this.dialog.open(ConfirmComponent,{
        width:'340px',
        height:'200px',
        data:{info}
      });
      //接收mat-dialog-close传值，为true删除
      dialogRef.afterClosed().subscribe(result=>{
        if(result==true){
          // let flage=this.restApi.del(this.selection.selected);
          this.selection.selected.forEach(element => {
            if(element.status!='new'){
              //循环删除服务器数据
                this.restApi.del(element).then(res=>{
                  //移出删除成功的
                  this.dataSource.data.splice(this.dataSource.data.indexOf(element),1);
                  this.dataSource._updateChangeSubscription();
                  this.selection.clear();
                  console.log('删除成功！');
                }).catch(err=>{
                  if(err.status===404){
                    this.dataSource.data.splice(this.dataSource.data.indexOf(element),1);
                    this.dataSource._updateChangeSubscription();
                    this.selection.clear();
                    console.log('404，未找到删除资源');
                  }else{
                    console.log('删除失败');
                    return;
                  }
                });
              }else{
                this.dataSource.data.splice(this.dataSource.data.indexOf(element),1);
                this.dataSource._updateChangeSubscription();
                this.selection.clear();
              }
            });
            // info='删除失败！';
            // this.dialog.open(AlertComponent,{
            //   width:'340px',
            //   data:{info}
            // });
        }
      });
    }else{
      info='没有选择！';
      this.dialog.open(AlertComponent,{
        width:'340px',
        data:{info}
      });
    }
  }
}
/**
 * 弹出框组件
 */
@Component({
  selector: 'home-dialog',
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
    public restApi:RestApiService,
  ){}
  //关闭对话框,返回修改后的数据
  onNoClick():void{
    let result:Template={
      serial_number:this.itemData.serial_number,
      batch:this.selectBatch,
      model:this.selectedModel,
      production_date:this.restApi.toYYYYMMDD(this.production_date),
      deliver_date:this.restApi.toYYYYMMDD(this.deliver_date),
      relevancy_party:this.relevancy_party,
      batch_comment:this.batch_comment,
      status:this.itemData.status,
    };
    this.dialogRef.close(result);
  }

  ngOnInit() {
    this.filteredOptions=this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(val=>this.filter(val)),
    );
    //pipe()和then()效果相同，then()方法返回一个新的承诺，可以通过函数过滤延迟的状态和值，取代现在不推荐使用的deferred.pipe()方法
    //source1.subscribe是订阅，即数据更新时的响应方法。同时返回订阅实例Subscription
    // forEach和subscribe相似，同是实现订阅效果，等到promise可以监控subscription完成和失败的异常。
    //startWith，source = source1.startWith(value), 表示在source1的最前面注入第一次发射数据
    //map，source = source1.map(func)表示source1每次发射数据时经过func函数处理，返回新的值作为source发射的数据
  }
  //过滤
  filter(val:string):string[]{
    return this.ModelList.filter(res=>
    res.toLowerCase().indexOf(val.toLowerCase())===0);
    //modelList.filter(res=>res.indexOf(val)===0)
    //返回String[]，返回val在res中首次出现的位置,首次出现的位置为0则返回。
  }
}
@Component({
  selector:'home-confirm',
  templateUrl:'../dialog/confirm.component.html',
})
export class ConfirmComponent{
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){}
  info = this.data.info;
}
@Component({
  selector:'home-alert',
  templateUrl:'../dialog/alert.component.html',
})
export class AlertComponent{
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){}
  info = this.data.info;
}
