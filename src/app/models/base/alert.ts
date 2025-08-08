import {FuseAlertType} from '../../../@fuse/components/alert';

/**
 * LuongNK create
 * BaseRequest
 */
export class AlertDTO {

    idMessage?: string;
    name?: string;
    message?: string;
    type?: FuseAlertType;

    constructor(alertDTO?: { idMessage: string; name: string; message: string ; type: FuseAlertType }, name: string = '', message: string = '', type: string = 'success') {
        this.idMessage = alertDTO.idMessage;
        this.name = alertDTO.name;
        this.message = alertDTO.message;
        this.type = alertDTO.type;
    }
}
