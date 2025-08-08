import {AuditModel} from '../base';
import {AdmAccountDetailDTO} from '../admin';
import {FsLoanProfileHistoryDTO} from './FsLoanProfileHistoryDTO.model';
import {FsReviewResultsDTO} from './FsReviewResultsDTO.model';
import {FsInvestorTransP2PDTO} from "./FsInvestorTransP2PDTO.model";
import {FsTransInvestorDTO} from "./FsTransInvestorDTO.model";
import {FsTranspayInvestorTransactionDTO} from "./FsTranspayInvestorTransactionDTO.model";

export class FsLoanProfilesDTO extends AuditModel {
    fsLoanProfilesId?: number;
    admAccountId?: number;
    admAccountName?: string;
    finDocumentsId?: string;
    type?: number;
    isAuto?: number;
    info?: string;
    amount?: number;
    feePlus?: number;
    interest?: number;
    totalAmount?: number;
    loanTimeCycle?: number;
    rate?: number;
    reasons?: string;
    reasonsName?: string;
    raisingCapitalName?: string;
    collateralType?: number;
    collateralTypeName?: string;
    collateralLoan?: number;
    loanTimeStart?: Date;
    loanTimeExpried?: Date;
    financialStatement?: string;
    admAccountDetailId?: number;
    loanProfilesCode?: string;
    remainingAmount?: number;
    level1ConfirmBy?: number;
    level2ConfirmBy?: number;
    level3ConfirmBy?: number;
    level4ConfirmBy?: number;
    level5ConfirmBy?: number;
    level6ConfirmBy?: number;
    expectedTime?: Date;
    remainAmount?: number;
    loanDocuments?: string;
    approvalInfo?: string;
    loanCycle?: number;
    fsConfRateId?: number;
    fee?: number;
    approveStatus?: number;
    listFileSolution?: string;
    reportLoanProfileAtt?: string;
    transComment?: string;
    minAmountInvestor?: number;
    solutionName?: string;
    solutionContent?: string;
    processStatus?: number;
    processStatusName?: string;
    financialScore?: number;
    qualitativeScore?: number;
    totalScore?: number;

    financialScoreChart?: Score; //điểm tài chính
    qualitativeScoreChart?: Score; //điểm định tính
    totalScoreChart?: Score;  //điểm
    riskRateChart?: Score;  //khả năng mất vốn

    salesStaff?: FsReviewResultsDTO;
    salesManager?: FsReviewResultsDTO;
    appraisalStaff?: FsReviewResultsDTO;
    appraisalManager?: FsReviewResultsDTO;
    ceo?: FsReviewResultsDTO;
    creditCouncil?: FsReviewResultsDTO;
    historyDTOS?: FsLoanProfileHistoryDTO[];

    //quan ly cong no
    totalDebitPaid?: number;
    paidAmount?: number;
    totalDebit?: number;
    penaltyCash?: number;
    transpayPeriodsProcessed?: string;

    lender?: AdmAccountDetailDTO;
    creditHistory?: FsLoanProfilesDTO[];
    fsInvestorTransP2PDTOS?: FsInvestorTransP2PDTO[];
    fsTransInvestorDTO?: FsTransInvestorDTO[];
    transpayInvTransactionDTOS?: FsTranspayInvestorTransactionDTO[];
}

export class Score {
    total: number;
    value: number;
    label: string;
}
