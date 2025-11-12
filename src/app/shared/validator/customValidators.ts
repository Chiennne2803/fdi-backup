import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {
    codeValidator(control: FormControl): { [key: string]: boolean } {
        const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (control.value && nameRegexp.test(control.value)) {
            return { invalidCode: true };
        }
    }

    public static nonNegativeDecimal(control: FormControl) {
        if (!control.value) return null;
        const isNonNegativeDecimal = control.value >= 0 && /^\d+(\.\d+)?$/.test(control.value);

        return isNonNegativeDecimal ? null : { nonNegativeDecimal: true };
    }

    public static noFutureYearValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            // Bỏ qua nếu không có dữ liệu
            if (!value) return null;

            // Chỉ nhận năm có 4 số
            const pattern = /^[0-9]{4}$/;
            if (!pattern.test(value)) {
                return { pattern: true };
            }

            const year = parseInt(value, 10);
            const currentYear = new Date().getFullYear();

            if (year > currentYear) {
                return { futureYear: true }; // lỗi năm tương lai
            }

            return null; // hợp lệ
        };
    }
}
