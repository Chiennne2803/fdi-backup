import { AuditModel } from './base';
import {ChartDTO} from "./ChartDTO.model";

export class AreaDTO {
    totalProfileWaiting?: number;//dang trinh phe duyet
    totalProfileApproval?: number;//dang niem yet
    totalProfileClose?: number;//da tat toan
    totalDebit?: number;//tong du no

    totalInvestWaiting?: number;
    totalInvestApproval?: number;
    accountBalance?: number;

    totalProfileRetry?: number;
    totalProfileRetrySuccess?: number;
    totalProfileNeedCheck?: number;
    totalProfileNeedCheckSuccess?: number;
    totalProfileReview?: number;
    totalProfileReviewSuccess?: number;

    debtToday?: number;
    debtThreeDay?: number;
    debtSevenDay?: number;

    newDebtToday?: number;
    debtCollectedToday?: number;

    chartDebit?: ChartDTO[];
}
