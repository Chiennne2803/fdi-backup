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
import {MAT_DATE_FORMATS, MatDateFormats} from '@angular/material/core';
import moment, {DurationInputObject, Moment} from 'moment';
import {APP_TEXT} from '../../constants';
import {ControlValueAccessor, FormControl, FormControlName, Validators} from '@angular/forms';
import {
    onlyCurrentYear,
    onlyPastYear,
} from '../../validator/date';
import {MatDatepicker} from '@angular/material/datepicker';

export const MAT_YEAR_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'YYYY'
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY'
    }
};

@Component({
    selector: 'date-picker-year-only',
    templateUrl: './date-picker-year-only.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: MAT_YEAR_FORMATS }
    ]
})
export class DatePickerYearOnlyComponent implements OnInit, OnChanges, ControlValueAccessor {
    @Input() styleFormFieldClass: string;
    @Input() label: string;
    @Input() maxYear: DurationInputObject;
    @Input() minYear: DurationInputObject;
    @Input() validationType: 'onlyCurrentYear' | 'onlyPastYear';

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
        if ( 'maxYear' in changes ) {
            this.max = moment().add(this.maxYear);
        }

        if ( 'minYear' in changes ) {
            this.min = moment().add(this.minYear);
        }

        if ( 'validationType' in changes ) {
            setTimeout(() => {
                this.addValidationForControl();
            });
        }
    }

    addValidationForControl(): void {
        this.control.addValidators(Validators.required);
        switch (this.validationType) {
            case 'onlyCurrentYear':
                // To disabled past and future years:
                // must set min is the start date of the year
                // and set max is the end date of the year
                const currentYear = moment().year();
                this.max = moment([currentYear, 11, 31]);
                this.min = moment([currentYear, 0, 1]);
                this.control.addValidators(onlyCurrentYear());
                break;
            case 'onlyPastYear':
                this.control.addValidators(onlyPastYear());
                break;
        }
        this.control.updateValueAndValidity();
    }

    yearSelected(normalizedYear: Moment, dp: MatDatepicker<any>): void {
        this.setControlValueToYearFormat(normalizedYear);
        dp.close();
    }

    setControlValueToYearFormat(value: Moment): void {
        const year = value.format('YYYY');
        this.control.setValue(year);
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
