/* eslint-disable @typescript-eslint/naming-convention */
export enum ChangeIdStatus {
    WAITING_APPROVE = 1,
    APPROVED = 2,
    REJECTED = 3,
};

export const CHANGE_ID_STATUS_TEXT_MAP = {
    [ChangeIdStatus.WAITING_APPROVE]: 'Chờ phê duyệt',
    [ChangeIdStatus.APPROVED]: 'Phê duyệt',
    [ChangeIdStatus.REJECTED]: 'Từ chối',
};
