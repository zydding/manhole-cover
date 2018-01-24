import { Component,Directive,ElementRef,HostListener,Input } from '@angular/core';
import { Http,Headers } from '@angular/http';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent {
  values='';
  cols=0;
  heroes=[];
  scrollHeight=0;
  constructor(private http:Http) {
    //初始化行号
    for(var j=0;j<15;j++){
      this.heroes.push('<div class="lineno">'+(j+1)+'</div>');
    }
  }
  /**
   * keyUp 事件
   * 在输入框内容做改变时触发
   * 做行号改变；获取输入框值
   * logic逻辑：获取textarea的滚动条高度，打印相同长度的列表，在页面循环列表，显示行号,通过margin-top以及hidden属性来显示15行
   */
  contentChange(objTextarea,lines){
    //this.cols=objTextarea.value.split("\n").length;
    this.scrollHeight=objTextarea.scrollHeight-300;
    this.cols=this.scrollHeight/20;
    this.heroes=[];
    if(this.cols>=1){
      for(var i=0;i<this.cols+15;i++){
        this.heroes.push('<div class="lineno">'+(i+1)+'</div>');
      }
      lines.style.marginTop='-'+(this.cols)*20+'px';
      //console.log("这是大于15"+this.heroes+'列表长度:'+this.heroes.length+'当前行数：'+this.cols);
    }else{
      //小于15
      for(var i=0;i<15;i++){
        this.heroes.push('<div class="lineno">'+(i+1)+'</div>');
      }
      lines.style.marginTop='0px';
      //console.log('显示行数:'+this.heroes.length+'当前行数：'+this.cols);
    }
  }
  /**
   * 获取头信息
   */
  getHeaders (){
    const headers= new Headers({'Accept': 'application/json'});
    return headers;
  }
  /**
   * 通过输入框的值获取服务器的数据
   * 
   * 服务器通过webpack代理方式通过cookie验证访问
   * @param boxValue 输入框的值
   */
  getList(boxValue){
    this.http.get("/batch-info",{headers:this.getHeaders()}).toPromise()
    .then(respone=>respone.json())
    .catch(err=>{
      console.log(err);
      return Promise.reject(err);
    });
  }
}
