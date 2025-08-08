import {AuditModel} from '../base';
import {FsCardDownDTO} from "./FsCardDownDTO.model";
import {FsDocuments} from "../admin";

export class FsReportDebtHistoryDTO extends AuditModel {
    fsReportDebtHistoryId?: number;
    name?: string;
    fsCardDownId?: number;
    fsCardDownCode?: string;
    fsReportDebtManagersId?: number;
    fsLoanProfilesId?: number;
    processingContent?: string;
    finDocumentsId?: string;

    finDocumentsIds: FsDocuments[];
}
