import { AuditModel } from '../base';

export class FsCardDownInvestorDTO extends AuditModel {
    fsCardDownInvestorId?: number;
    fsCardDownId?: number;
    fsTransInvestorId?: number;
    transInvestorName?: string;
    admAccountIdLoan?: number;
    admAccountIdInvestor?: number;
    amount?: number;
    admAccountIdInvestorName?: string;
    info?: string;
    role?: string;
    transCode?: string;
    transComment?: string;
    processDate?: Date;
    interest?: number;
    interesAtimate?: number;
}
