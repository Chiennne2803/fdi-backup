import { AuditModel } from '../base';

export class AdmAccountDTO extends AuditModel {
    admAccountId?: number;
    accountName?: string;
    passwd?: string;
    newPasswd?: string;
    reNewPasswd?: string;
    type?: number;
    source?: number;
    codePresenter?: string;
    codeUser?: string;
    fullName?: string;
}
