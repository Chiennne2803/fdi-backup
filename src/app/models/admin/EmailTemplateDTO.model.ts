export class EmailTemplateDTO {
    admEmailTemplateId?: number;
    type?: number;
    subject?: string;
    header?: string;
    body?: string;
    footer?: string;
    listFileAtt?: string;
    status?: number;
    statusName?: string;
    createdBy?: number;
    createdByName?: string;
    lastUpdatedBy?: number;
    lastUpdatedByName?: string;
    createdDate?: number;
    lastUpdatedDate?: number;
    actionKey?: string;
}

