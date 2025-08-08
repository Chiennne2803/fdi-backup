/**
 * LuongNK create
 * BaseRequest
 */
export class BaseRequest {
    page: number;
    limit: number;
    quickSearch?: string;
    key?: string;
    ids?: number[];
    screenMode?: any;

    constructor(page: number = 0, limit: number = 10, quickSearch: string = '', key: string = '') {
        this.page = page;
        this.limit = limit;
        this.quickSearch = quickSearch;
        this.key = key;
    }
}
