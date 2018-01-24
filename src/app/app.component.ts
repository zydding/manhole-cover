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
  login_state:Subscription;
  values='';
  cols=0;
  heroes=[];
  scrollHeight=0;
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
    
  }
  /**
   * keyUp 事件
   * 在输入框内容做改变时触发
   * 做行号改变；获取输入框值
   * logic逻辑：获取textarea的滚动条高度，打印相同长度的列表，在页面循环列表，显示行号,通过margin-top以及hidden属性来显示15行
   */
  contentChange(objTextarea,lines):void{
    this.scrollHeight=objTextarea.scrollHeight-300;
    this.cols=this.scrollHeight/20;
    this.heroes=[];
    if(this.cols>=1){
      for(var i=0;i<this.cols+15;i++){
        this.heroes.push('<div class="lineno">'+(i+1)+'</div>');
      }
      lines.style.marginTop='-'+(this.cols)*20+'px';
    }else{
      //小于15行
      for(var i=0;i<15;i++){
        this.heroes.push('<div class="lineno">'+(i+1)+'</div>');
      }
      lines.style.marginTop='0px';
    }
  }

  /**
   * 通过输入框的值获取服务器的数据
   * 
   * 服务器通过webpack代理方式通过cookie验证访问
   * @param boxValue 输入框的值
   */
  getList(boxValue):Promise<Template[]>{
    return this.restApi.getList(boxValue);
  }
  
}
