import { AuditModel } from '../base';

export class FsTopupDTO extends AuditModel {
    fsTopupId?: number;
    fsTopupCode?: string;

    admAccountIdRecive?: number;
    admAccountIdReciveName?: string;

    admAccountIdManager?: number;
    admAccountIdManagerName?: string;

    amount?: number;
    fee?: number;
    source?: number;
    info?: string;

    level1ConfirmBy?: string;
    level2ConfirmBy?: string;
    level3ConfirmBy?: string;
    level4ConfirmBy?: string;
    level5ConfirmBy?: string;
    level6ConfirmBy?: string;

    accNo?: string;
    bankName?: string;
    branchName?: string;
    accName?: string;

    transactionTime?: Date;
    transactionAmount?: number;
    transactionType?: string;
    transactionCode?: string;
}
