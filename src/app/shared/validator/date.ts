import { AbstractControl, ValidatorFn } from '@angular/forms';
import moment from 'moment';

export const notAllowFutureDays = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const today = moment();
    const invalid = moment(control.value).isAfter(today);
    return invalid ? {'biggerThanToday': control.value} : null;
};

export const mustLessThanToday = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const today = moment().subtract(1, 'days');
    const invalid = moment(control.value).isAfter(today);
    return invalid ? {'lessThanToday': control.value} : null;
};

export const upper18YearsOld = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const today = moment();
    const birthDay = moment(control.value);
    const invalid = today.diff(birthDay, 'years');
    return invalid < 18 ? {'mustUpper18': control.value} : null;
};

export const onlyCurrentYear = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const currentDate = moment();
    const invalid = moment(control.value).isSame(currentDate, 'year');
    return invalid ? null : {'onlyCurrentYear': control.value};
};

export const onlyPastYear = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const today = moment().subtract(1, 'year');
    const invalid = moment(control.value).isAfter(today);
    return invalid ? {'onlyPastYear': control.value} : null;
};

export const validDateFormat = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    if (control.value) {
        const valid = moment(control.value, 'DD/MM/YYYY').isValid();
        return valid ? null : {'invalidDateFormat': control.value};
    }
    return null;
};

