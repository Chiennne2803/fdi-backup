/* eslint-disable @typescript-eslint/naming-convention */
export enum AccountBankEnum {
    INVESTOR = 3,
    LOANER = 4,
    CASH_FUNDING = 5,
    CASH_HO = 6,
};

export const ACCOUNT_BANK_TYPE_TEXT_MAP = {
    [AccountBankEnum.INVESTOR]: 'Tài khoản nhà đầu tư',
    [AccountBankEnum.LOANER]: 'Tài khoản bên huy động vốn',
    [AccountBankEnum.CASH_FUNDING]: 'Tài khoản Tiếp quỹ tiền mặt',
    [AccountBankEnum.CASH_HO]: 'Tài khoản rút tiền phí HO',
};
