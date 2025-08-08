/* eslint-disable @typescript-eslint/naming-convention */
export enum autoInvestmentStatusEnum {
    DOING = 1,
    DONE = 2,
    ACTIVE_CANCEL = 3,
    AUTO_CANCEL = 4,
};

export const AUTO_INVESTMENT_STATUS = {
    [autoInvestmentStatusEnum.DOING]: 'Hoạt động',
    [autoInvestmentStatusEnum.DONE]: 'Hoàn thành',
    [autoInvestmentStatusEnum.ACTIVE_CANCEL]: 'Huỷ chủ động',
    [autoInvestmentStatusEnum.AUTO_CANCEL]: 'Huỷ tự động',
};
