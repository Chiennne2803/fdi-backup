import { AbstractControl, ValidatorFn } from '@angular/forms';


export const DOCUMENT_FILE_NAME_VALIDATOR = '^.+\\.(([xX][lL][sS][xX])|([xX][lL][sS][mM])|([xX][lL][sS]))$';

export const forbiddenUserNameValidator = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const regExp = new RegExp(/^[a-zA-Z0-9@_\\.]{6,50}$/);
    const forbidden = regExp.test(control.value);
    return forbidden ? null : {'forbiddenUserName': {value: control.value}};
};

export const emailValidator = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const regExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    let validEmail: boolean = true;
    if ( control.value ) {
        validEmail = regExp.test(control.value);
    }
    return validEmail ? null : {'invalidEmail': {value: control.value}};
};

export const forbiddenPasswordValidator = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) return null;

    // Regex đồng bộ với BE, bỏ dấu chấm
    const regExp = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,50}$/
    );

    const valid = regExp.test(control.value);
    return valid ? null : { forbiddenPassword: { value: control.value } };
  };
};

export const forbiddenPhoneNumberValidator = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const regExp = new RegExp(/(0[1|2|3|4|5|6|7|8|9])+([0-9]{8}|[0-9]{9})$/);
    const forbidden = regExp.test(control.value);
    return forbidden ? null : {'forbiddenPhoneNumber': {value: control.value}};
};

export const forbiddenOtpValidator = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const regExp = new RegExp(/^[0-9]{4,50}$/);
    const forbidden = regExp.test(control.value);
    return forbidden ? null : {'forbiddenOtp': {value: control.value}};
};
