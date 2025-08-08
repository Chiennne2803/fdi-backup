import {AuditModel} from '../base';

export class FsTranspayInvestorTransactionDTO extends AuditModel {
    fsTranspayInvestorTransactionId?: number;
    admAccountId?: number;
    fsLoanProfilesId?: number;
    fsCardDownId?: number;
    fsTranspayReqId?: number;
    fsTranspayInvestorId?: number;
    amount?: number;
    interest?: number;
    fee?: number;
    feeTax?: number;
    isP2P?: number;
    admAccountIdTransferor?: number;
    transCode?: string;
    perTax?: number;
    taxPayer?: number;
    fsTransInvestorId?: number;
    originalDeduction?: number;
    interestDeduction?: number;
    overdueInterestDeduction?: number;
}
