import {AuditModel} from '../base';

export class FsConfCreditDTO extends AuditModel {
    fsConfCreditId?: number;
    creditCode?: string;
    minValue?: number;
    maxValue?: number;
    type?: number;
    info?: string;
}
