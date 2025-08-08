import { AuditModel } from '../base';
import {AdmActionAuditDTO} from "./AdmActionAuditDTO.model";

export class AdmActionDetailDTO extends AuditModel {
    actionDetailId?: number;
    admActionAuditId?: number;
    admAccessLogId?: number;
    tableName?: string;
    colName?: string;
    newValue?: string;
    oldValue?: string;
    rowId?: number;
}
