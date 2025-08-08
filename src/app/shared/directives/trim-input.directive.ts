import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[trimInput]'
})
export class TrimInputDirective {

    constructor(private el: ElementRef) { }

    @HostListener('blur', ['$event.target.value'])
    onBlur(value: string) {
        this.el.nativeElement.value = value.trim();
    }

}
