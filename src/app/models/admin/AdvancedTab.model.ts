import {AuditModel} from '../base';
import {AdmDepartmentsDTO} from "./AdmDepartmentsDTO.model";

export class AdvancedTab extends AuditModel {
    moduleName?: string;
    admDepartmentsDTOS?: AdmDepartmentsDTO[];
}
