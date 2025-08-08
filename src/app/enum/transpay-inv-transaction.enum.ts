/* eslint-disable @typescript-eslint/naming-convention */
export enum TRANS_PAY_INV_STATUS {
    WAIT_ACCOUNTING = 1,
    PAID = 2,
}

export const TRANS_PAY_INV_STATUS_TEXT_MAP = {
    [TRANS_PAY_INV_STATUS.WAIT_ACCOUNTING]: 'Chờ hạch toán',
    [TRANS_PAY_INV_STATUS.PAID]: 'Đã thanh toán',
};
