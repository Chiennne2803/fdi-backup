import {AuditModel} from '../base';

export class FsReviewResultsDTO extends AuditModel {

    fsReviewResultsId?: number;
    approvalBy?: number;
    approvalByName?: string;
    approvalDate?: Date;
    content?: string;
    type?: number;
    finDocumentsId?: string;
    financialStatement?: string;
    fsLoanProfilesId?: number;
    saleComment?: string;
    saleNote?: string;
    loanProfilesScreening?: number;
    loanProfilesScreening2?: number;
    loanProfilesScreening3?: number;
    loanProfilesScreening4?: number;
    loanProfilesScreening5?: number;
    loanProfilesScreening6?: number;
    loanProfilesScreening7?: number;
    loanProfilesScreening8?: number;
    loanProfilesScreening9?: number;
    loanProfilesScreening10?: number;
    loanProfilesScreening11?: number;
    loanProfilesScreeningScore?: number;
    rate?: string;

    votingResults?: FsReviewResultsDTO[];
}
