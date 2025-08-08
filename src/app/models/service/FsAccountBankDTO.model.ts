import {AdmAccountDetailDTO, AdmCategoriesDTO, AdmDeputyContactDTO} from '../admin';
import { AuditModel } from '../base';

export class FsAccountBankDTO extends AuditModel {
    fsAccountBankId?: number;
    fsAccNo?: number;
    accName?: string;
    admAccountId?: number;
    accNote?: string;
    accType?: number;
    balance?: number;
    fsAccountBankDetailId?: number;
    balanceAfter?: number;
    balanceBefore?: number;
    accNo?: string;
    bankName?: string;
    bankBranch?: string;
    bankId?: number;
}

export class AccountModel {
    accountBank: FsAccountBankDTO;
    accountDetail: AdmAccountDetailDTO;
    lstBank: AdmCategoriesDTO[];
    sex: AdmCategoriesDTO[];
    capitalContributors: AdmDeputyContactDTO[];
    contact: AdmDeputyContactDTO[];
    jobCode: AdmCategoriesDTO[];
    marriageCode: AdmCategoriesDTO[];
    lvhdCode: AdmCategoriesDTO[];
    bctcCode: AdmCategoriesDTO[];
    bclt: AdmCategoriesDTO[];
    representative: AdmDeputyContactDTO;
}
