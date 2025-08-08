import {AuditModel} from "../base";

export class AdmProcessConfigDTO extends AuditModel {
    admProcessConfigId: number
    key: string
    cronExpression: string
    processName: string
}
