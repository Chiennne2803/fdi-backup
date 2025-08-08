import {AuditModel} from '../base';
import {FsDocuments} from "./FsDocuments.model";

export class AdmValuationHistoryDTO extends AuditModel {
    admValuationHistoryId?: number;
    admAccountId?: number;
    admCollateralId?: number;
    admCollateralName?: string;
    amount?: number;
    guaranteedRate?: number;
    valuationName?: string;
    valuationDate?: Date;
    fileId?: string;

    fileIdObj: FsDocuments[];
}
