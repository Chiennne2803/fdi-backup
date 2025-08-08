import {AuditModel} from '../base';
import {FsTopupMailTransferDTO} from './FsTopupMailTransferDTO.model';
import {FsLoanProfilesDTO} from './FsLoanProfilesDTO.model';
import {AdmAccountDetailDTO} from '../admin';

export class FsTranspayReqDTO extends AuditModel {
    fsTranspayReqId?: number;
    fsLoanProfilesId?: number;
    fsCardDownId?: number;
    fsCardDownCode?: string;
    admAccountId?: number;
    fsConfigLoanOfdId?: number;
    isPrepayment?: number;
    isPaymentInvester?: number;
    payType?: number;
    paidAmount?: number;
    originalDeduction?: number;
    interestDeduction?: number;
    principalBalancePeriod?: number;
    interestBalancePeriod?: number;
    principalPaidPeriod?: number;
    interestPaidPeriod?: number;
    principalAmountDue?: number;
    interestAmountDue?: number;
    overdueInterestOnPrincipal?: number;
    overdueInterestOnInterest?: number;
    amountTax?: number;
    principalBalanceEndPeriod?: number;
    interestBalanceEndPeriod?: number;
    paidBankAmount?: number;
    expirDate?: Date;
    paidDate?: Date;
    accNo?: number;
    accName?: string;
    bankName?: string;
    branchName?: string;
    bankDescription?: string;
    status?: number;
    approvalBy?: number;
    approvalDate?: Date;
    approvalComment?: string;
    transCode?: string;
    approveByName?: string;
    admAccountName?: string;
    loanTimeCycle?: number;
    rate?: number;

    topupMailTransferDTO?: FsTopupMailTransferDTO;
    listTranspayReqWait?: FsTranspayReqDTO[];
}

export class PrepareLoadingPageTrans {
    loanProfiles?: FsLoanProfilesDTO;
    lstAccountApproval?: AdmAccountDetailDTO;
}
