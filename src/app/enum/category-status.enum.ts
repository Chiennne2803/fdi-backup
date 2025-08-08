/* eslint-disable @typescript-eslint/naming-convention */
export enum CategoryStatus {
    ACTIVE = 1,
    CLOSED = 2
};

export const CATEGORY_STATUS_TEXT_MAP = {
    [CategoryStatus.ACTIVE]: 'Hoạt động',
    [CategoryStatus.CLOSED]: 'Không hoạt động',
};
