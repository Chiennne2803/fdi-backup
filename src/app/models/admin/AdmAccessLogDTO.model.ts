import { AuditModel } from '../base';
import {AdmActionAuditDTO} from "./AdmActionAuditDTO.model";

export class AdmAccessLogDTO extends AuditModel {
     admAccessLogId?: number;
     browser?: string;
     device?: string;
     empId?: string;
     hostname?: string;
     ip?: string;
     loginTime?: Date;
     logoutTime?: Date;
     url?: string;
     admAccountId?: number;
     admAccountName?: string;
     token?: string;
     admAccountType?: number;
    lstAdmActionAuditDTOS?: AdmActionAuditDTO[];
}
