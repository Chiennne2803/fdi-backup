import { AuditModel } from '../base';

export class AdmCustomerRankDTO extends AuditModel {
    admCustomerRankId?: number;
    admAccountId?: number;
    fsConfCreditId?: number;
    creditCode?: string;
    scores?: number;
    rank?: number;
}
