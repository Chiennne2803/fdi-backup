import { AuditModel } from '../base';

export class FsConfRateDTO extends AuditModel {
    fsConfRateId?: number;
    fsConfCreditId?: number;
    creditCode?: string;
    tenor?: number;
    fee?: number;
    periodPay?: number;
    minAmount?: number;
    creditRateAdd?: number;
    minMortgateRate?: number;
    maxMortgateRate?: number;
    collateralType?: number;
    mortgateRateRange?: string;
    note?: string;
}
