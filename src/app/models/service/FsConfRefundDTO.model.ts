import {AuditModel} from '../base';

export class FsConfRefundDTO extends AuditModel {
    fsConfRefundId?: number;
    minLoan?: number;
    maxLoan?: number;
    rateCapitalPenalty?: number;
    rateFeePenalty?: number;
    ratePrepayPenalty?: number;
    percentFee?: number;
    percentManager?: number;
    percentTranfer?: number;
    minBlance?: number;
    percentTax?: number;
    investFee?: number;

    autoInvestExpiration?: number;
    refundExpiration?: number;
    p2PExpiration?: number;
    stopCapital?: number;
    overdueDeb?: number;
    accByPassMinInvest?: number;
    p2PRemainingDays?: number;
    amountBypassDebt?: number;
    percentTaxCompany?: number;
    percentTaxBonus?: number;
    percentTaxBonusCompany?: number;
}
