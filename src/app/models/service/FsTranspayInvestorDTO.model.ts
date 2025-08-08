import {AuditModel} from '../base';
import {FsAccountBankDTO} from './FsAccountBankDTO.model';
import {FsLoanProfilesDTO} from './FsLoanProfilesDTO.model';
import {FsTransInvestorDTO} from "./FsTransInvestorDTO.model";
import {FsTranspayInvestorDetailDTO} from "./FsTranspayInvestorDetailDTO.model";

export class FsTranspayInvestorDTO extends AuditModel {
    fsTranspayInvestorId?: number;
    transCode?: string;
    fsLoanProfilesId?: number;
    lenderName?: string;
    amount?: number;
    interest?: number;
    amountCapital?: number;
    fee?: number;
    loanCycle?: number;
    exprieDate?: Date;
    approvalBy?: number;
    approvalByName?: string;
    info?: string;
    transComment?: string;
    feeTax?: number;
    fsCardDownId?: number;
    fsCardDownCode?: string;
    approvalComment?: string;
    approvalDate?: Date;
    payType?: number;
    fsTranspayReqId?: number;
    fsTranspayReqCode?: string;
    transpayReqPrincipal?: number;
    transpayReqInterest?: number;
    admAccountId?: number;
    assignDate?: Date;
    assignTo?: number;
    assignComment?: string;
    enablePayType?: number;

    fsTransInvestorDTOS?: FsTransInvestorDTO[];
    lstTranspayInvestorDetail?: FsTranspayInvestorDetailDTO[];
}

/*
export class FsTranspayInvestorModel {
    accountBank?: FsAccountBankDTO;
    loanProfile?: FsLoanProfilesDTO;
    lstTranspayInvestorDetail?: FsTranspayInvestorDTO[];
    transpayReq?: FsTranspayInvestorDTO;
}
*/
