import { AuditModel, BaseResponse } from '../base';
import { AdmAccountDetailDTO } from './AdmAccountDetailDTO.model';
import {AdmRolesAdvanceDTO} from "./AdmRolesAdvanceDTO.model";

export class AdmDepartmentsDTO extends AuditModel {
    admAccountId?: number;
    admDepartmentsCode?: string;
    admDepartmentsId?: number;
    departmentName?: string;
    admcategoriesId?: string;
    accoutName?: string;
    fullName?: string;
    groupRoleName?: string;
    parentDepId?: number;
    countStaff?: number;

    lstAccount?: object[];
    admRolesAdvanceDTOS?: AdmRolesAdvanceDTO[];
};


export interface DeparmentPrepareObject {
    lstUser: Array<AdmAccountDetailDTO>;
}

export interface DepartmentPrepareResponse extends BaseResponse {
    payload: DeparmentPrepareObject;
}

export interface DepartmentBaseResponse extends BaseResponse {
    payload: AdmDepartmentsDTO;
};
