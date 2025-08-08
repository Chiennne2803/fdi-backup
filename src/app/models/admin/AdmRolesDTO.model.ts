import {AuditModel} from '../base';

export class AdmRolesDTO extends AuditModel {
    admRolesId?: number;
    admAccountId?: number;
    linkId?: number;
    module?: string;
    isSelect?: boolean;
    isInsert?: boolean;
    isUpdate?: boolean;
    isDelete?: boolean;
    isExport?: boolean;
    isAcceptance?: boolean;
    admRoleGroupId?: number;
}
