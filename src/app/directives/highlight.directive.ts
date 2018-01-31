import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  boxValue='';
  @HostListener('load') onload(){

  }
  @HostListener('keypress',['$event']) private onKeyPress($event:Event):void{
    var code = "";
    var lastTime,nextTime;
    var lastCode,nextCode;
    //debugger;
    nextCode = $event['keyCode'];
    var value=$event['key'];

      nextTime = new Date().getTime();
      if(lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
          code += String.fromCharCode(lastCode);
          this.boxValue=code;
          console.log(this.boxValue);
      } else if(lastCode != null && lastTime != null && nextTime - lastTime > 100){
          code = "";
      }
      lastCode = nextCode;
      lastTime = nextTime;
  }
  // private highlight (color : string){
  //   this.el.nativeElement.style.backgroundColor=color;
  // }
  constructor(private el: ElementRef) {
    
  }
}
