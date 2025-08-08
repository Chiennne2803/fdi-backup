import { AuditModel } from '../base';
import {AdmRolesDTO} from "./AdmRolesDTO.model";
import {AdvancedTab} from "./AdvancedTab.model";

export class AdmGroupRoleDTO extends AuditModel {
    admGroupRoleId?: number;
    groupRoleName?: string;

    timeStart?: number;
    timeEnd?: number;
    info?: string;

    roles?: AdmRolesDTO[];
    lstModuleReportNdt?: AdmRolesDTO[];
    lstModuleReportHdv?: AdmRolesDTO[];
    lstModuleReportAcc?: AdmRolesDTO[];
    lstAdvancedTabs?: AdvancedTab[];

};

export class DecentralizedModel {
    module: string;
    isSelect: boolean = false;
    isInsert: boolean = false;
    isUpdate: boolean = false;
    isDelete: boolean = false;
    isExport: boolean = false;
    isAcceptance: boolean = false;
};

export class ModuleModel {
    module: string;
    isSelect: boolean = false;
    isSelectDetail: boolean = false;
    isUpdate: boolean = false;
    isDelete: boolean = false;
    isAssign: boolean = false;
    isExport: boolean = false;
    isAcceptance: boolean = false;
};

