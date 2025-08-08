/* eslint-disable @typescript-eslint/naming-convention */
import { AdmDeputyContactDTO } from '.';
import { AuditModel } from '../base';

export interface UserModel extends AuditModel {
    accountName: string;
    fullName: string;
    avatar?: string;
    mobile: string;
    email: string;
    identification: string;
    dateOfIdnumber?: number;
    placeOfIdnumber?: string;
    genderName: string;
    dateOfBirth: number;
    maritalName?: string;
    jobName?: string;
    jobAddress?: string;
    taxCode: string;
    facebook?: string;
    address1: string;
    address2: string;
    address3?: string;
    type: UserType;
    deputyContact?: AdmDeputyContactDTO;
    idDate?: number;
    idAddress?: string;
    positionCompany?: string;
    frontPhotoIdentication?: string;
    backsitePhotoIdentication?: string;
    admCategoriesName?: string;
    businessLicense?: string;
    businessLicenseDate?: number;
    placeOfBusinessLicense?: string;
    landline?: string;
    website?: string;
    businessCode?: string;
    economicInfoDocuments?: string;
    legalDocuments?: string;
    businessDocumentation?: string;
}

/**
 * INDIVIDUAL = 1, //ca nhan
 * COMPANY = 2, // doanh nghiep
 */
export enum UserType {
    INDIVIDUAL = 1, //ca nhan
    COMPANY = 2, // doanh nghiep
}

export enum AccountDetailStatus {
    WAIT_CONFIRM = 0,
    WAIT_APPROVE = 1,
    APPROVE = 2,
    REJECT = 3,
}

export const UserAvatarMap = {
    [UserType.INDIVIDUAL]: 'assets/images/images/canhanvayvon.svg',
    [UserType.COMPANY]: 'assets/images/images/doanhnghiepvayvon.svg'
}

