import {AuditModel} from '../base';

export class FsTransWithdrawCashDTO extends AuditModel {
    fsTransWithdrawCashId?: number;
    amount?: number;
    fee?: number;
    info?: string;
    admAccountIdRecipient?: number;
    admAccountIdRecipientName?: string;
    accNo?: string;
    bankName?: string;
    transCode?: string;
    branchName?: string;
    accName?: string;
    transComment?: string;
    type?: number;
    approvalBy?: number;
    approvalByName?: string;
    approvalDate?: Date;
    note?: string;
    approvalComment?: string;
    assignDate?: Date;
    assignTo?: number;
    assignToName?: string;
    assignComment?: string;

    availableBalances?: number;
    wEu?: number;
}
