import {IBaseDataSourceObj} from './base.model';

export interface IAddressForm {
    province: IBaseDataSourceObj;
    district: IBaseDataSourceObj;
    commune: IBaseDataSourceObj;
    street: string;
}

export interface IAddressData {
    province: string;
    district: string;
    commune: string;
    street: string;
    payload: string;
    type?: 'new' | 'old';
}
