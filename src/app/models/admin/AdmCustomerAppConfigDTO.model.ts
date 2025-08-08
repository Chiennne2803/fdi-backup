import {AuditModel} from "../base";

export class AdmCustomerAppConfigDTO extends AuditModel {
    admCustomerAppConfigId: number
    key: string
    type: number
    feature: string
    note: number
    lstFeature: AdmCustomerAppConfigDTO[]
}
