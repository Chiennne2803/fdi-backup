import { UserType } from 'app/models/admin';

/* eslint-disable @typescript-eslint/naming-convention */
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status: UserAccountStatus;
    accountType: AdmAccountType;
    type: UserType;
    fullName: string;
    accountName: string;
    admAccountId: number;
    roles: string[];
    role: number;
}

export interface LoginResponse {
    access_token: string;
    userInfo: User;
}

export enum AdmAccountType {
    INVESTOR = 1,
    BORROWER = 2,
    ADMIN = 3,
}

export enum UserAccountStatus {
    MUST_KYC = 0,
    WAS_KYC = 1,
    ACTIVE = 2,
}
