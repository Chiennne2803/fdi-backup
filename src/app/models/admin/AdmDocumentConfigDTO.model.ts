import {AuditModel} from '../base';

export class AdmDocumentConfigDTO extends AuditModel {
    admDocumentConfigId?: number;
    admDocumentConfigName?: string;
    admDocumentConfigType?: string;
    fileId?: string;
    admAccountId?: number;
}
