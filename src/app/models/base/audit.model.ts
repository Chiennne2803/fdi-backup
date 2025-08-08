/**
 * LuongNK create
 * AuditModel
 */
export class AuditModel {
    page?: number;
    limit?: number;

    //trang thai
    status?: number;
    statusName?: string;

    //nguoi tao
    createdBy?: number;
    createdByName?: string;

    //ngay tao
    createdDate?: Date;
    createdDateFrom?: Date;
    createdDateTo?: Date;

    //nguoi cap nhat
    lastUpdatedBy?: number;
    lastUpdatedByName?: string;

    //ngay cap nhat
    lastUpdatedDate?: Date;
    lastUpdatedDateFrom?: Date;
    lastUpdatedDateTo?: Date;

    actionKey?: string;
}
