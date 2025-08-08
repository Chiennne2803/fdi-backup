/* eslint-disable @typescript-eslint/naming-convention */
export enum FundingTypeEnum {
    CASH = 2,
    ELECTRON = 3
};

export const FUNDING_TYPE_STATUS_TEXT_MAP = {
    [FundingTypeEnum.CASH]: 'Tiếp quỹ tiền mặt',
    [FundingTypeEnum.ELECTRON]: 'Tiếp quỹ tiền điện tử',
};
