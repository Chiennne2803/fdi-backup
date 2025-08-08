import {AuditModel} from '../base';

export class AdmRolesAdvanceDTO extends AuditModel {
    admRolesAdvanceId?: number;
    admRoleGroupId?: number;
    module?: string;
    departmentId?: number;
    admAccountId?: number;
    isSelect?: number;
    isUpdate?: number;
    isInsert?: number;
    isDelete?: number;
    isExport?: number;
    isAcceptance?: number;
    fullName?: string;
}
