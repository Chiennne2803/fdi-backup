import { AuditModel } from "../base";

export class SpNotificationModuleDTO extends AuditModel {
    id?: number;
    name?: string;
    listAction?: SpNotificationModuleDTO[];
}