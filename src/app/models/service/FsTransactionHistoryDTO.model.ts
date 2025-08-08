import {AuditModel} from '../base';

export class FsTransactionHistoryDTO extends AuditModel {
    fsTransactionHistoryId?: number;
    admAccountId?: number;
    fsLoanProfilesId?: number;
    oldAmount?: number;
    amount?: number;
    newAmount?: number;
    transCode?: string;
    transDate?: number;
    transType?: number;
    transTypeName?: string;
    isAuto?: boolean;
}
