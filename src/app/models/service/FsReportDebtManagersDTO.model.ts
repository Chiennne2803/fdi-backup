import {AuditModel} from '../base';
import {FsLoanProfilesDTO} from "./FsLoanProfilesDTO.model";
import {FsCardDownDTO} from "./FsCardDownDTO.model";

export class FsReportDebtManagersDTO extends AuditModel {
    fsReportDebtManagersId?: number;
    fsLoanProfilesId?: number;
    admAccountId?: number;
    fullName?: string;
    loanTimeCycle?: number;
    totalAmount?: number;
    totalAmountInteres?: number;
    payAmount?: number;
    expireRate?: number;
    totalAmountDeb?: number;
    isOverdueDeb?: number;
    rate?: number;

    lstFsCardDown?: FsCardDownDTO[];
}

