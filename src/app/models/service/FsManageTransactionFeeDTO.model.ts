import {AuditModel} from '../base';

/**
 * dau tu tu dong
 */
export class FsManageTransactionFeeDTO extends AuditModel {

    fsManageTransactionFeeId?: number;
    admAccountIdBeneficiary?: number;
    admAccountIdPresenter?: number;
    fsLoanProfilesId?: number;
    transDate?: Date;
    amount?: number;
    perTax?: number;
    amountTax?: number;
    type?: number;
    transactionCode?: string;
    cardDownAmount?: number;
    originOfTransaction?: number;

    admAccountIdBeneficiaryName?: string;
    admAccountIdPresenterName?: string;
    originOfTransactionName?: string;
}
