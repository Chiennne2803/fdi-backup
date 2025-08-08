import { AbstractControl, ValidatorFn } from '@angular/forms';

export const FILE_NAME_VALIDATOR = '^.+\\.(([pP][nN][gG])|([jJ][pP][gG])|([pP][dD][fF]))$';
export const EXCEL_FILE_NAME_VALIDATOR = '^.+\\.(([xX][lL][sS])|([xX][lL][sS][xX]))$';
export const IMAGE_FILE_VALIDATOR = '^.+\\.(([pP][nN][gG])|([jJ][pP][gG])|([jJ][pP][eE][gG]))$';
export const IMAGE_WITH_PDF_FILE_VALIDATOR = '^.+\\.(([pP][nN][gG])|([jJ][pP][gG])|([jJ][pP][eE][gG])|([pP][dD][fF]))$';
export const REPORT_FILE_VALIDATOR = '^.+\\.(([pP][dD][fF])|([wW][oO][rR][dD]))$';
export const REPORT_WITH_EXCEL_FILE_VALIDATOR = '^.+\\.(([xX][lL][sS])|([xX][lL][sS][xX])|([pP][dD][fF])|([wW][oO][rR][dD]))$';

const fileNameValidation = (control: AbstractControl, regex: RegExp): boolean => {
    let nameOfFiles: string[];
    let invalid: boolean = true;
    if ( control.value && Array.isArray(control.value) && control.value.length > 0 ) {
        nameOfFiles = control.value.map((val: File) => val?.name);
        invalid = nameOfFiles?.every(name => regex.test(name));
    }
    return invalid;
}

export const validateByPattern = (pattern): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const regex = new RegExp(pattern);
    const invalid = fileNameValidation(control, regex);
    return invalid ? null : { 'validateByPattern': {value: control.value} };
};

export const commonFileType = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const regex = new RegExp(FILE_NAME_VALIDATOR);
    const invalid = fileNameValidation(control, regex);
    return invalid ? null : { 'commonFileType': {value: control.value} };
};

export const excelFileType = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const regex = new RegExp(EXCEL_FILE_NAME_VALIDATOR);
    const invalid = fileNameValidation(control, regex);
    return invalid ? null : { 'excelFileType': {value: control.value} };
};

export const reportFileType = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const regex = new RegExp(REPORT_FILE_VALIDATOR);
    const invalid = fileNameValidation(control, regex);
    return invalid ? null : { 'reportFileType': {value: control.value} };
};

export const reportWithExcelFileType = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const regex = new RegExp(REPORT_WITH_EXCEL_FILE_VALIDATOR);
    const invalid = fileNameValidation(control, regex);
    return invalid ? null : { 'reportWithExcelFileType': {value: control.value} };
};

export const imageFileType = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const regex = new RegExp(IMAGE_FILE_VALIDATOR);
    const invalid = fileNameValidation(control, regex);
    return invalid ? null : { 'imageFileType': {value: control.value} };
};

export const imageWithPdfFileType = (): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    const regex = new RegExp(IMAGE_WITH_PDF_FILE_VALIDATOR);
    const invalid = fileNameValidation(control, regex);
    return invalid ? null : { 'imageWithPdfFileType': {value: control.value} };
};

export const validateFileSize = (maxSize: string | number): ValidatorFn => (control: AbstractControl): { [key: string]: any } => {
    let fileSizesToMB: number[];
    let invalid: boolean = true;
    if ( control.value && Array.isArray(control.value) && control.value.length > 0 ) {
        fileSizesToMB = control.value.map((val: File) => val?.size / (1024 * 1024));
        invalid = fileSizesToMB?.every(size => Number(maxSize) >= size);
    }
    return invalid ? null : { 'validateFileSize': {value: control.value} };
};
