import { AuditModel } from '../base';
import { FsManageTransactionFeeDTO } from './FsManageTransactionFeeDTO.model';
import {AdmAccountDetailDTO} from "../admin";
import {FsTopupMailTransferDTO} from "./FsTopupMailTransferDTO.model";

export class FsChargeCashReqDTO extends AuditModel {
    fsChargeCashReqId?: number;
    transCode?: string;
    fsLoanProfilesId?: number;
    fullName?: string;
    fromWalletId?: number;
    toWalletId?: number;
    fromWallet?: string;
    toWallet?: string;
    fromAccNo?: string;
    fromBankName?: string;
    toBankName?: string;
    toAccNo?: string;
    transInfo?: string;
    transType?: string | number;
    amount?: number;
    fromAdmAccountId?: number;
    fromAdmAccountName?: string;
    toAdmAccountId?: number;
    toAdmAccountName?: string;
    perTax?: number;
    feeTax?: number;
    toBranchName?: string;
    note?: string;

    approvalBy?: number;
    approvalByName?: string;
    approvalDate?: Date;
    approvalComment?: string;

    availableBalances?: number;
    manageTransactionFeeIds?: string;

    assignTo?: number;
    assignToName?: string;
    assignComment?: string;
    assignDate?: Date;

    fsManageTransactionFeeId?: number;
    amountTax?: number;

    transactionFeeDTOS?: FsManageTransactionFeeDTO[];
    admAccountDetailDTOS?: AdmAccountDetailDTO[];
    topupMailTransferDTO?: FsTopupMailTransferDTO;

    transTypeName?: string;
}
