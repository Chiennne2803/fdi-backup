import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[inputMask]',
})
export class InputMaskDirective {
    @Input() maskType: string = '';
    constructor(
        private _elr: ElementRef
    ) { }

    @HostListener('input', ['$event'])
    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        switch (this.maskType) {
            case 'datetime':
                (event.target as HTMLInputElement).value = this.formatDateTime(value);
                break;
            case 'address-detail':
                (event.target as HTMLInputElement).value = this.formatAddressDetail(value);
                break;
            case 'number':
                (event.target as HTMLInputElement).value = this.onlyNumber(value);
                break;
        }
    }

    formatDateTime(value: string): string {
        return value.replace(/[^\d/]/g, '');
    }

    onlyNumber(value: string): string {
        return value.replace(/[^\d]/g, '');
    }

    formatAddressDetail(value: string): string {
        return value.replace(/,/g, '');
    }
}
