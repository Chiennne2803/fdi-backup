import { DurationInputObject } from 'moment';
import { IBaseDataSourceObj } from '../../../models/base.model';

export interface KycPrepareLoadingPage {
    errorCode?: string;
    message?: string;
    paramMessage?: string;
    payload: PayloadPrepareLoadingPage[];
}

export interface PayloadPrepareLoadingPage {
    forms: FormsPrepareLoadingPage[];
    formGroupName: string;
    // formControlNameShared?: string;
    isEnd: boolean;
    kycStep: number;
    deputyType: number;
    title: string;
    isPosted: boolean;
}

export interface FormsPrepareLoadingPage {
    formControlName: string;
    admDfFieldId: string;
    dateSource: string;
    dateSourceObj: IBaseDataSourceObj[];
    colspan: number;
    extraField: string;
    inputType: string;
    label: string;
    maxlength: number;
    name: string;
    placeholder: string;
    pattern?: string;
    require?: string;
    requireMesage?: string;
    typeMessage?: string;
    maxlenMesage?: string;
    position: number;
    rowspan: number;
    type: string;
    maxDate?: DurationInputObject;
    dateValidation?: string[];
    defaultValue?: string;
}
