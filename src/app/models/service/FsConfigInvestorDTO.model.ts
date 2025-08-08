import { AuditModel } from '../base';

/**
 * dau tu tu dong
 */
export class FsConfigInvestorDTO extends AuditModel {
    fsConfigInvestorId?: number;
    investmentAmount?: number;
    investmentTime?: number;
    preMatchingAmount?: number;
    matchingAmount?: number;
    interestRate?: number;
    revenueEstimate?: number;
    topupAmount?: number;
}
