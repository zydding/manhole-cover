import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  boxValue='';
  @HostListener('keypress',['$event']) private onKeyPress($event:Event):void{
    let code = $event['keyCode'];
    console.log(code);
    if(code===118){
      alert(1);
    }
  }
  // private highlight (color : string){
  //   this.el.nativeElement.style.backgroundColor=color;
  // }
  constructor(private el: ElementRef) {
    
  }
}
