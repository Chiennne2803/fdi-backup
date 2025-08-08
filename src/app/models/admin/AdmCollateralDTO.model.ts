import {AuditModel} from '../base';
import {FsDocuments} from './FsDocuments.model';

export class AdmCollateralDTO extends AuditModel {
    admCollateralId?: number;
    collateralName?: string;
    collateralType?: number;
    info?: string;
    fileId?: string;
    fsDocumentsDTOS?: FsDocuments[];
    admAccountId?: number;
    amount?: number;
    guaranteedRate?: number;
    raisingCapital?: number;
    valuationDate?: Date;

}
