import {AuditModel} from '../base';

export class AdmCreditLimitDTO extends AuditModel {
    admCreditLimitId?: number;
    creditLimit?: number;
    finDocumentsId?: string;
    admAccountId?: number;
}
