import {AuditModel} from '../base';
import {AdmAccountDetailDTO} from '../admin';

export class FsAccountInfoReqDTO extends AuditModel {
    fsAccountInfoReqId?: number;
    transCode?: string;
    admAccountId?: number;
    transInfo?: string;
    type?: string;
    approvalBy?: number;
    approvalByName?: string;
    approvalDate?: Date;
    approvalInfo?: string;

    oldAccountDetailDTO?: AdmAccountDetailDTO;
    newAccountDetailDTO?: AdmAccountDetailDTO;
}
