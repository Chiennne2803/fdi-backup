/* eslint-disable @typescript-eslint/naming-convention */
export enum PROCESS_RESULT_CODE {
    CREATE_NEW = 0,
    PARTIAL_TRANSFER = 1,
    COMPLETE = 2,
    FAILURE = 3
};

export const PROCESS_RESULT_NAME = {
    [PROCESS_RESULT_CODE.CREATE_NEW]: 'Tạo mới',
    [PROCESS_RESULT_CODE.PARTIAL_TRANSFER]: 'Chuyển nhượng một phần',
    [PROCESS_RESULT_CODE.COMPLETE]: 'Hoàn thành',
    [PROCESS_RESULT_CODE.FAILURE]: 'Thất bại',
};
