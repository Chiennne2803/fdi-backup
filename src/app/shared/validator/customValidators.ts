import {FormControl} from "@angular/forms";

export class CustomValidators {
    codeValidator(control: FormControl): { [key: string]: boolean } {
        const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (control.value && nameRegexp.test(control.value)) {
            return { invalidCode: true };
        }
    }

    public static nonNegativeDecimal(control: FormControl) {
        if(!control.value) return null;
        const isNonNegativeDecimal = control.value >= 0 && /^\d+(\.\d+)?$/.test(control.value);

        return isNonNegativeDecimal ? null : { nonNegativeDecimal: true };
    }
}
