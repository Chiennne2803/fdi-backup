import {AuditModel} from '../base';

export class FsTransInvestorDTO extends AuditModel {
    fsTransInvestorId?: number;
    admAccountId?: number;
    fullName?: string;
    investorCode?: string;
    finDocumentsId?: string;
    isAuto?: number;
    type?: number;
    typeName?: string;
    amount?: number;
    investorTime?: number;
    rate?: number;
    interestAtimate?: number;
    interest?: number;
    investorTimeStart?: Date;
    investorTimeExpried?: Date;
    area?: string;
    fsLoanProfilesId?: number;
    info?: string;
    amountWaitMatch?: number;
    amountMatched?: number;
    remainingAmount?: number;
    transComment?: string;
    loanProfilesCode?: string;

    p2PAmount?: number;
    p2PInterest?: number;
    p2PRate?: number;
    p2PTransInvesterId?: number;
    fsConfigInvestorId?: number;
    p2PFeeInvestor?: number;
    p2PTaxInvestor?: number;
    fsInvestorTransP2PId?: number;
    feeP2P?: number;

    //man danh sach chi tiet nha dau tu
    lenderName?: string;
    loanAmount?: number;
    payAmount?: number;

    transferableAmount?: number;
}
