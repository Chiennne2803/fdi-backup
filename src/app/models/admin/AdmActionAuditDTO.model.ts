import { AuditModel } from '../base';

export class AdmActionAuditDTO extends AuditModel {
    admActionAuditId?: number;
    admAccessLogId?: number;
    admAccountId?: number;
    function?: string;
    actionCode?: string;
    issueDatetime?: Date;
    description?: string;
}
