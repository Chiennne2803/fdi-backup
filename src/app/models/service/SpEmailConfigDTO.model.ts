import { AuditModel } from '../base';

export class SpEmailConfigDTO extends AuditModel {
    spEmailConfigId?: number;
    displayName?: string;
    encodeType?: number;
    fromEmail?: string;
    isDefault?: number;
    isUse?: number;
    password?: string;
    requireAuth?: number;
    smtpPort?: number;
    smtpServer?: string;
    username?: string;
};
