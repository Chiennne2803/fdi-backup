import { AuditModel } from '../base';

export class AdmDeputyContactDTO extends AuditModel {
    admDeputyContactId?: string;
    referenContact?: string;
    gender?: string;
    genderName?: string;
    dateOfBirth?: Date;
    identification?: string;
    idDate?: Date;
    idAddress?: string;
    avatar: string;
    mobile?: string;
    email?: string;
    job?: string;
    jobAddress?: string;
    facebook?: string;
    address1?: string;
    address2?: string;
    fullName?: string;
    type?: number;
    taxCode?: string;
    frontPhotoIdentication?: string;
    backsitePhotoIdentication?: string;
    admAccountId?: number;
    positionCompany?: string;
    avata?: string;
}
