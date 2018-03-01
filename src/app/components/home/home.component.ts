import { Component, OnInit,Inject } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { Template } from '../../interfaces/template';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { forEach } from '@angular/router/src/utils/collection';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormControl, Validators,FormBuilder,FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { SelectionModel } from '@angular/cdk/collections';
import { myErrorStateMatcher } from '../../services/myErrorStateMatcher';

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
  dirtyList:Template[]=[];
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
            this.getOrg(boxValue,res);
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
              production_date:this.dealProductionDate(boxValue),
              deliver_date:this.restApi.toYYYYMMDD(new Date()),
              relevancy_party:'',
              batch_comment:'',
              status:'new',
              change:true
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
  //处理生产日期字符串
  dealProductionDate(serial_number:string){
    var patter=/\d{12}/g;
    let arr1:RegExpExecArray;
    if((arr1=patter.exec(serial_number))!=null){
      return arr1[0].substring(0,4)+'-'+arr1[0].substring(4,6)+'-'+arr1[0].substring(6,8);//0-7的日期字符串
    }
  }
  getOrg(serial_number:string,obj:Template){
    //设备关联信息
    this.restApi.getOrg(serial_number).then(res=>{
      //合并设备信息
      obj.relevancy_party=res.org_name;
    }).catch(err=>{
      console.log('错误信息：没有取到设备关联信息');
    });
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
        if(result.batch!=item.batch){
          result.change=true;
          this.dataSource.data[index].batch=result.batch;
        }
        if(result.model!=item.model){
          result.change=true;
          this.dataSource.data[index].model=result.model;
        }
        if(result.production_date!=item.production_date){
          result.change=true;
          this.dataSource.data[index].production_date=result.production_date;
        }
        if(result.deliver_date!=item.deliver_date){
          result.change=true;
          this.dataSource.data[index].deliver_date=result.deliver_date;
        }
        if(result.batch_comment!=item.batch_comment){
          result.change=true;
          this.dataSource.data[index].batch_comment=result.batch_comment;
        }
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
    let dialogRef=this.openConfirm(info);
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
    let arrayList=boxValue.split('/');
    boxValue=arrayList[arrayList.length-1];
    //这里是扫码
    //console.log('输入了：'+boxValue);
    await this.dirtyList.push(boxValue);
    boxValue=this.dirtyList.pop();//取最后一项
    //console.log('这是list：'+this.dirtyList.toString()+'即将添加'+boxValue);
    //需要先处理字符串
    let arrayA=this.dealArray(boxValue);
    if(arrayA.length>0){
      let value=arrayA[0].value;//取第一个匹配
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
    let saveData=this.selection.selected;//获取选择并修改过的data
    let info='';
    //判断选择
    if(saveData.length>0){
      saveData=this.dealSaveData();//获取选择并修改过的data
      //判断修改数据
      if(saveData.length>0){
        //判断空值
        const flag=this.checkNull(saveData);
        if(flag){
          info = '你确定保存吗？';
          let dialogRef=this.openConfirm(info);
          //接收mat-dialog-close传值，为true删除
          dialogRef.afterClosed().subscribe(result=>{
            if(result==true){
              console.log('长度：'+this.dataSource.data.length);//5-1=4，循环5次
              for(let i=0;i<(saveData.length);i++){
                let flage=this.restApi.save(saveData[i]).then(res=>{
                  // debugger;
                  //循环到最后一次成功则成功，失败一次则失败
                  if(i===(saveData.length-1)){
                    info='保存成功！';
                    // this.dialog.closeAll();//关闭所有
                    this.openAlert(info);
                    console.log('保存成功！');
                  }
                  //获取关联厂家
                  this.getOrg(saveData[i].serial_number,saveData[i])
                  saveData[i].status='old';//改变状态为old
                  saveData[i].change=false;
                }).catch(err=>{
                  // debugger;
                  //返回err表示保存失败
                  // debugger;
                  if(err.status){
                    console.log();
                    let obj=this.dealError(err._body);
                    // console.log(err._body[0]);
                    info='保存失败！'+obj;
                    this.dialog.closeAll();//关闭所有
                    this.openAlert(info);
                    console.log('保存失败！');
                    return;
                  }else{
                    if(i===(saveData.length-1)){
                      info='保存成功！';
                      // this.dialog.closeAll();//关闭所有
                      this.openAlert(info);
                      //获取关联厂家
                      this.getOrg(saveData[i].serial_number,saveData[i])
                      saveData[i].status='old';//改变状态为old
                      saveData[i].change=false;
                    }
                  }
                });
              }
            }
          });
        }else{
          let info='空值不能保存！';
          this.openAlert(info);
        }
      }else{
        let info='没有修改过的数据！';
        this.openAlert(info);
      }
    }
    else{
      info='没有选择数据！';
      this.openAlert(info);
    }
  }
  /**
   * 判断空值
   * @param data 选中修改的数据
   */
  checkNull(data:Template[]){
    let flag=true;
    data.forEach(element => {
      if(element.batch=='' || !(element.batch_comment)){
        flag=false;
        return;
      }
      if(element.model=='' || !(element.batch_comment)){
        flag=false;
        return;
      }
      if(element.batch_comment=='' || !(element.batch_comment)){
        flag=false;
        return;
      }
    });
    return flag;
  }
  dealSaveData(){
    let selectData=this.selection.selected;
    let dirtyData:Template[]=[];
    dirtyData.splice(0,dirtyData.length);
    selectData.forEach(element => {
      if(element.change){
        dirtyData.push(element);
      }
    });
    return dirtyData;
  }
  openConfirm(info){
    return this.dialog.open(ConfirmComponent,{
      width:'340px',
      height:'200px',
      data:{info}
    });
  }
  openAlert(info){
    this.dialog.open(AlertComponent,{
      width:'340px',
      data:{info}
    });
  }
  dealError(obj){
    let res='';
    if(JSON.parse(obj).batch){
      res='批次不能为空，';
    }
    if(JSON.parse(obj).model){
      res+='型号不能为空，';
    }
    if(JSON.parse(obj).comment){
      res='备注不能为空';
    }
    return res;
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
          if(result.production_date!=item.production_date){
            objMerge='production_date';
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
      this.openAlert(info);
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
          ele.change=true;
        });
        break;
      case 'model':
        this.selection.selected.forEach(ele=>{
          ele.change=true;
          ele.model=result.model;
        });
        break;
      case 'production_date':
        this.selection.selected.forEach(ele=>{
          ele.change=true;
          ele.production_date=result.production_date;
        });
        break;
      case 'deliver_date':
        this.selection.selected.forEach(ele=>{
          ele.change=true;
          ele.deliver_date=result.deliver_date;
        });
        break;
      case 'batch_comment':
        this.selection.selected.forEach(ele=>{
          ele.change=true;
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
      let dialogRef=this.openConfirm(info);
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
        }
      });
    }else{
      info='没有选择！';
      this.openAlert(info);
    }
  }
}
/**
 * 弹出框组件
 */
@Component({
  selector: 'home-dialog',
  templateUrl: './dialog.component.html',
  styleUrls:['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  formGroupControl:FormGroup;
  //数据
  itemData=this.data.item;
  
  ModelList=[
    'DT20180201',
    'DT20180202',
    'EC2-D600',
  ];
  filteredOptions: Observable<string[]>;

  constructor(
    private formBulider:FormBuilder,
    private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef :MatDialogRef<DialogComponent>,
    public restApi:RestApiService,
  ){
    this.createForm();
  }
  createForm(){
    this.formGroupControl=this.formBulider.group({
      batch:new FormControl({value:''},Validators.required),
      model:new FormControl({value:''},Validators.required),
      production_date:new FormControl({value:'',},Validators.required),
      deliver_date:new FormControl({value:''},Validators.required),
      relevancy_party:new FormControl({value:'',}),
      batch_comment:new FormControl({value:''},Validators.required),
    });
    this.formGroupControl.patchValue({
      batch:this.itemData.batch,
      model:this.itemData.model,
      production_date:this.dealProductionDate(this.itemData.serial_number),
      deliver_date:this.itemData.deliver_date,
      relevancy_party:this.itemData.relevancy_party,
      batch_comment:this.itemData.batch_comment,
    });
  }
  //处理生产日期字符串
  dealProductionDate(serial_number:string){
    var patter=/\d{12}/g;
    let arr1:RegExpExecArray;
    if((arr1=patter.exec(serial_number))!=null){
      return arr1[0].substring(0,4)+'-'+arr1[0].substring(4,6)+'-'+arr1[0].substring(6,8);//0-7的日期字符串
    }
  }
  prepareSave():Template{
    const value=this.formGroupControl.value;
    const save:Template={
      serial_number:this.itemData.serial_number,
      batch:value.batch,
      model:value.model,
      production_date:this.restApi.toYYYYMMDD(value.production_date),
      deliver_date:this.restApi.toYYYYMMDD(value.deliver_date),
      relevancy_party:value.relevancy_party,
      batch_comment:value.batch_comment,
      status:this.itemData.status,
      change:false,
    }
    return save;
  }
  onNoClick(){
    //其中有空值
    if(this.formGroupControl.invalid){
      let info='有*号的输入框不能为空！';
      this.dialog.open(AlertComponent,{
        width:'340px',
        data:{info}
      });
    }else{
      this.dialogRef.close(this.prepareSave());
    }
  }

  ngOnInit() {
    this.filteredOptions=this.formGroupControl.get('model').valueChanges
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
