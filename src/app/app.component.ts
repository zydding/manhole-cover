import { OnDestroy,OnInit, Component,Directive,ElementRef,HostListener,Input } from '@angular/core';
import { RestApiService } from './services/rest-api.service'
import { Subscription } from 'rxjs/Subscription';
import { Template } from './interfaces/template';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent implements OnInit,OnDestroy {
  login_state:Subscription;//Subscription可以调用unsubscribe方法，销毁Observable可观察对象
  heroes=[];
  box3='';
  flag:boolean;
  constructor(private restApi:RestApiService) {
    //初始化行号
    for(var j=0;j<15;j++){
      this.heroes.push('<div class="lineno">'+(j+1)+'</div>');
    }
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
   * keyUp 事件
   * 在输入框内容做改变时触发
   * 做行号改变；获取输入框值
   * logic逻辑：获取textarea的滚动条高度，打印相同长度的列表，在页面循环列表，显示行号,通过margin-top以及hidden属性来显示15行
   */
  contentChange(objTextArea,ObjDiv):void{
    const top=200;//输入框的高度
    const colsNumber=10;//输入框的行数
    var scrollHeight=objTextArea.scrollHeight-top;
    var cols=scrollHeight/20;
    this.heroes=[];
    if(cols>=1){
      for(var i=0;i<cols+colsNumber;i++){
        this.heroes.push('<div class="lineno">'+(i+1)+'</div>');
      }
      //ObjDiv.style.marginTop='-'+(this.cols)*20+'px';
    }else{
      //小于15行
      for(var i=0;i<colsNumber;i++){
        this.heroes.push('<div class="lineno">'+(i+1)+'</div>');
      }
      //ObjDiv.style.marginTop='0px';
    }
  }

  /**
   * scroll滚动时触发的事件，让div滚动起来
   * logic用timeout来控制事件延迟加载
   */
  scrollEvent(objTextArea,ObjDiv){
    if(timeout){
      clearTimeout(timeout);
    }
    var scrollHeight=objTextArea.scrollTop;
    var timeout=setTimeout(() => {
      ObjDiv.style.marginTop='-'+scrollHeight+'px';
    }, 200);
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
  /**
   * 处理BoxValue的格式
   */
  dealArray(boxValue:string):any[]{
    console.log('字符总长度：'+boxValue.length);
    var patter1=/EC2-\d{12}/g;//匹配EC2
    var patter2=/CL\d{12}/g;//匹配CL
    var flag_EC2=patter1.exec(boxValue);
    var flag_CL=patter2.exec(boxValue);
    var result='';
    var a=[];
    var arr1,arr2;
    while((arr1=patter1.exec(boxValue))!=null){
      a.push(arr1);
      result=boxValue.replace(new RegExp(arr1,'g'),'');
    }
    console.log('结果1为:'+result+'长度为：'+result.length);
    while((arr2=patter2.exec(result))!=null){
      a.push(arr2);
      result=result.replace(new RegExp(arr2,'g'),'');
    }
    console.log('结果2为:'+result+'长度为：'+result.length);
    result=result.replace(/\D/,'');//去除非数字
    var resultEnd='';
    for(var k=0;k<Math.floor(result.length/12);k++){
      if(result.length>=12){
        a.push(result.substring(0,12));
        result=result.replace(new RegExp(result.substring(0,12),'g'),'');
      }
    }
    console.log('结果3为:'+a.toString()+'长度为：'+a.length);
    return null;
  }
  /**
   * 测试
   */
  test(){
    var name = 'aaa hhh ccc';
    //\w+表示匹配字母，数字或者下划线，，\b表示必须出现在开头或者结尾
    var ss=name.replace(/\b\w+\b/g,function(word){
      return word.substring(0,1).toUpperCase()+word.substring(1);
    });
    
    console.log("javascript".replace(/java/,"$&$' is "));
    console.log(ss);
  }
  /**
   * 生成序列
   */
  runSeq(x1,x2,x3,num){
    var b=[x1,x2,x3];
    var a=[];
    for(var i=0;i<num;i++){
      var x=Math.ceil(Math.random()*3);//向上取整
      a.push(b[x-1]);
    }
    //debugger;
    this.box3=a.toString().replace(/,/g,'');
    if(this.box3.length>0){
      this.flag=true;
    }
  }
}
