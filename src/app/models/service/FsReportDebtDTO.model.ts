import {AuditModel} from '../base';
import {FsCardDownDTO} from "./FsCardDownDTO.model";

export class FsReportDebtDTO extends AuditModel {
    fsReportDebtId?: number;
    fsCardDownId?: number;
    fsCardDownCode?: string;
    finDocumentsId?: number;
    processingContent?: string;
    solutionId?: number;
    solutionName?: string;
    fsReportDebtManagersId?: number;
    fsLoanProfilesId?: number;
    isCloseLoanProfiles?: number;
    fsConfigLoanOfdId?: number;

    fsCardDownIds?: number[];
}
