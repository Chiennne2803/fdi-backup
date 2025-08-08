import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[lowerCaseInput]'
})
export class LowerCaseInputDirective {

    constructor(private el: ElementRef) { }

    @HostListener('blur', ['$event.target.value'])
    onBlur(value: string) {
        this.el.nativeElement.value = value.toLowerCase();
    }

}
