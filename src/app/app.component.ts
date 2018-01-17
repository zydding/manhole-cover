import { Component,Directive,ElementRef,HostListener,Input } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
  
})
export class AppComponent {
  title = 'app';
  values='';
  cols=0;
  heroes=[];
  i=0;
  html='';
  contentChange(value:string,obj,lines){
    this.values=value+' | ';
    this.cols=obj.value.split("\n").length;
    if(this.cols>=15){
      lines.style.marginTop='-'+(this.cols-15)*20+'px';
      
      for(this.i=0;this.i<=this.cols;this.i++){
        this.html+='<div class="lineno">'+this.i+'</div>';
      }
      lines.innerHTML=this.html;
    }else{
      // for(this.i<=15;this.i++;){

      // }
    }
  }
  constructor(private el: ElementRef) {
        
  }
  color:string;
}
