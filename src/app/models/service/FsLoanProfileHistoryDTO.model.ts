import {AuditModel} from '../base';

export class FsLoanProfileHistoryDTO extends AuditModel {
    fsLoanProfileHistoryId?: number;
    fsLoanProfilesId?: number;
    admAccountId?: number;
    admAccountName?: string;
    approvalDate?: Date;
    positionCompany?: string;
    content?: string;
    type?: string;
}
