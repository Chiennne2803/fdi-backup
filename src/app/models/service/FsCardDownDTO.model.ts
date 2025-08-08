import {AuditModel} from '../base';

export class FsCardDownDTO extends AuditModel {
    fsCardDownId?: number;
    admAccountId?: number;
    fsLoanProfilesId?: number;
    transCode?: string;
    amount?: number;
    amountInteresAtimate?: number;
    fee?: number;
    feeRate?: number;
    amountRecive?: number;
    principalAmountDue?: number;
    interestAmountDue?: number;
    investorTimeStart?: number;
    expirDate?: number;
    accNo?: number;
    accName?: string;
    bankName?: string;
    branchName?: string;
    paymentStatus?: number;
    paymentStatusName?: string;
    approvalBy?: number;
    approvalByName?: number;
    approvalDate?: number;
    approvalComment?: string;
    principalAmountDebtInvest?: number;
    assignDate?: number;
    assignTo?: number;
    assignToName?: string;
    assignComment?: string;

    accountName?: string;
    source?: number;
    info?: string;
    listTransInvestorId?: string;
    processDate?: Date;
    role?: string;
    transComment?: string;
    totalAmountInteres?: number;
    totalAmountRecive?: number;
    totalAmountInteresAtimate?: number;

    lastPaidDate?: Date;
}
