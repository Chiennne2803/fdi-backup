import { AuditModel } from '../base';

export class FsTopupDTO extends AuditModel {
    fsTopupId?: number;
    admAccountIdRecive?: number;
    admAccountIdReciveName?: string;
    source?: number;
    amount?: number;
    fee?: number;
    level1ConfirmBy?: string;
    level2ConfirmBy?: string;
    level3ConfirmBy?: string;
    level4ConfirmBy?: string;
    level5ConfirmBy?: string;
    level6ConfirmBy?: string;
    info?: string;
    fsTopupCode?: string;
    accNo?: string;
    bankName?: string;
    branchName?: string;
    accName?: string;
    admAccountIdManager?: number;
    admAccountIdManagerName?: string;

    transactionTime?: Date;
    transactionAmount?: number;
    transactionType?: string;
    transactionCode?: string;
}
