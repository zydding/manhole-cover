import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
    
    @HostListener('mouseenter') onMouseEnter(){
        this.highlight('#eeeeee');
    }
    @HostListener('mouseleave') onMouseLeave(){
        this.highlight(null);
    }
    @HostListener('load') onload(){

    }
    private highlight (color : string){
        this.el.nativeElement.style.backgroundColor=color;
    }
    constructor(private el: ElementRef) {
        
    }
}