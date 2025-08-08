import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    Optional,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, FormControl, FormControlName, Validators} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats} from '@angular/material/core';
import moment, {DurationInputObject, Moment} from 'moment';
import {APP_TEXT} from '../../constants';
import {mustLessThanToday, notAllowFutureDays, upper18YearsOld} from '../../validator/date';

export const DATE_FORMATTER: MatDateFormats = {
    parse: {
        dateInput: 'DD/MM/YYYY'
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY'
    }
};

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATTER },
    ],
    encapsulation: ViewEncapsulation.None,
})
export class DatePickerComponent implements ControlValueAccessor, OnChanges, OnInit {
    @Input() styleFormFieldClass: string;
    @Input() label: string;
    @Input() maxDate: DurationInputObject;
    @Input() maxDateTime: Moment;
    @Input() minDateTime: Moment;
    @Input() validationType: string[];
    @Input() minDate: DurationInputObject;
    @Input() isRequired: boolean = false;

    @Input() requiredMsg: string;
    @Input() fomatMsg: string;
    @Input() y18Msg: string;
    @Input() maxMsg: string;
    @Input() minMsg: string;

    biggerThanTodayMessage: string = 'Vượt quá ngày cho phép';
    mustLessThanTodayMessage: string = 'Ngày không được < Ngày hôm qua';
    appText = APP_TEXT;
    control: FormControl;
    max: Moment;
    min: Moment;
    onChange: (value: any) => void;
    onTouched: () => void;

    constructor(
        @Optional() private _controlName: FormControlName,
        private _cdr: ChangeDetectorRef,
    ) {
        if ( this._controlName !== null ) {
            this._controlName.valueAccessor = this;
        }

    }

    ngOnInit(): void {
        this.control = this._controlName?.control;
        this._cdr.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.biggerThanTodayMessage= this.label + ' không được > Ngày tối đa';
        this.mustLessThanTodayMessage = this.label +  ' không được < Ngày tối thiểu';

        if (this.control?.errors) {
            this.control?.setErrors(null)
        }
        if ('maxDate' in changes) {
            this.max = moment().add(this.maxDate);
        }
        if ('maxDateTime' in changes) {
            this.max = this.maxDateTime;
        }

        if ('minDate' in changes) {
            this.min = moment().add(this.minDate);
        }
        if ('minDateTime' in changes) {
            this.min = this.minDateTime;
        }

        if ('validationType' in changes) {
            setTimeout(() => {
                this.addValidationForControl();
            });
        }
        if ( 'label' in changes ) {
            this.setValidateMessage();
        }
        if ( 'isRequired' in changes && this.control != undefined) {
            let change = changes['isRequired'];
            let curVal  = JSON.stringify(change.currentValue);
            if (curVal == 'true') {
                this.control.addValidators(Validators.required);
            } else {
                this.control.removeValidators(Validators.required);
            }
        }
        this.control?.updateValueAndValidity();
    }

    setValidateMessage(): void {
        if ( this.validationType ) {
            this.validationType.forEach((type) => {
                switch (type) {
                    case 'today':
                        if ( this.label.includes('Ngày cấp') ) {
                            this.biggerThanTodayMessage = 'Ngày cấp không được > Ngày hiện tại';
                        }

                        if ( this.label.includes('Ngày sinh') ) {
                            this.biggerThanTodayMessage = 'Ngày sinh không được > Ngày hiện tại';
                        }
                        break;
                    case 'yesterday':
                        if ( this.label.includes('Ngày cấp') ) {
                            this.mustLessThanTodayMessage = 'Ngày cấp không được > Ngày hôm qua';
                        }

                        if ( this.label.includes('Ngày sinh') ) {
                            this.mustLessThanTodayMessage = 'Ngày sinh không được > Ngày hôm qua';
                        }
                        break;
                }
            });
        }
    }

    addValidationForControl(): void {
        this.validationType.forEach((type) => {
            switch (type) {
                case 'upper18':
                    this.control.addValidators(upper18YearsOld());
                    break;
                case 'today':
                    this.control.addValidators(notAllowFutureDays());
                    break;
                case 'yesterday':
                    this.control.addValidators(mustLessThanToday());
                    break;
            }
        });
        this.control.updateValueAndValidity();
    }

    getValidatorErrors(): string | null {
        if (this.control.touched) {
            if (this.control.hasError('matDatepickerParse')) {
                return this.fomatMsg ? this.fomatMsg : this.appText.form.errors.invalidDateFormat;
            }
            if (this.control.hasError('mustUpper18')) {
                return this.y18Msg ? this.y18Msg :this.appText.form.errors.mustUpper18;
            }
            if (this.control.hasError('biggerThanToday') || this.control.hasError('matDatepickerMax')) {
                return this.maxMsg ? this.maxMsg : this.biggerThanTodayMessage;
            }
            if (this.control.hasError('lessThanToday') || this.control.hasError('matDatepickerMin')) {
                return this.minMsg ? this.minMsg : this.mustLessThanTodayMessage;
            }
            if (this.control.hasError('required')) {
                return this.requiredMsg ? this.requiredMsg : this.appText.form.errors.required;
            }
        }
        return null;
    }

    // VALUE ACCESSOR METHODS PROVIDED BY FORMS API
    writeValue(value: any): void { }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        // Set disabled to form control in here
    }
}
