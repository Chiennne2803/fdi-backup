/* eslint-disable @typescript-eslint/naming-convention */
export enum UserType {
    CA_NHAN = 1,
    DOANH_NGHIEP = 2,
}

export enum UserStatus {
    ACTIVE = 1,
    LOCKED = 2,
    CLOSED = 3
};

export enum DeputyType {
    REPRESENTATIVE = 1,
    CONTACT = 2,
    CAPITAL_CONTRIBUTOR = 3,
}

export const USER_STATUS_TEXT_MAP = {
    [UserStatus.ACTIVE]: 'Hoạt động',
    [UserStatus.LOCKED]: 'Khoá',
    [UserStatus.CLOSED]: 'Đóng',
};

export enum AccountType {
    INVESTOR = 1,
    LENDER = 2,
    ADMIN = 3,
};

export enum Status {
    ACTIVE = 1,
    INACTIVE = 2
};

export const USER_TYPE_STATUS_TEXT_MAP = {
    [UserType.CA_NHAN]: 'Cá nhân',
    [UserType.DOANH_NGHIEP]: 'Doanh nghiệp',
};


export const USER_INFO_TYPE_REQ = {
    [1]: 'CCCD/Hộ chiếu',
    [2]: 'Giấy phép kinh doanh',
};


export enum BORROWER_INVESTOR_STATUS {
    NOT_VERIFIED,
    AWAIT_APPROVAL,
    APPROVED,
    REFUSE
}

export const BORROWER_INVESTOR_STATUS_COLOR_MAP = {
    [BORROWER_INVESTOR_STATUS.NOT_VERIFIED]: '#c0392b',
    [BORROWER_INVESTOR_STATUS.AWAIT_APPROVAL]: '#f1c40f',
    [BORROWER_INVESTOR_STATUS.APPROVED]: '#2ecc71',
    [BORROWER_INVESTOR_STATUS.REFUSE]: '#000',
};
