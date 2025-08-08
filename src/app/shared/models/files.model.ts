import {FormGroup} from '@angular/forms';

export interface AppZoneConfig {
    multiple: boolean;
    maxFile: number;
    topTitle: string;
    field: string;
    styleInput: string;
    type?: string;
    accept?: string;
    maxFileSize?: number;
}

export interface UploadFileDialog {
    title: string;
    config: AppZoneConfig[];
    formGroup: FormGroup;
    blockResetForm: boolean;
}
