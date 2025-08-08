import {AuditModel} from '../base';
import {FsManageTransactionFeeDTO} from './FsManageTransactionFeeDTO.model';

export class FsTranferWalletReqDTO extends AuditModel {
    fsTranferWalletReqId?: number;
    fsLoanProfilesId?: number;
    transCode?: string;
    fullName?: string;
    fromWalletId?: number;
    toWalletId?: number;
    fromWallet?: string;
    toWallet?: string;
    amount?: number;
    tranType?: number;
    transComment?: string;
    admAccountId?: number;
    originalId?: string;
    manageTransactionFeeIds?: string;
    approvalComment?: string;
    assignDate?: Date;
    assignTo?: number;
    assignComment?: string;
    approvalBy?: number;
    approvalByName?: string;
    approvalDate?: Date;

    transactionFeeDTOS?: FsManageTransactionFeeDTO[];
}
