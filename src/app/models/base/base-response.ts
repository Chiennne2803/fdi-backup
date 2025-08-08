/* eslint-disable id-blacklist */
/**
 * LuongNK create
 * BaseResponse
 */
export interface BaseResponse {
    message?: string;
    errorCode?: string;
    payload?: any;

    content: object[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable?: object;
    size: number;
    sort?: object;
    totalElements: number;
    totalPages: number;
}
