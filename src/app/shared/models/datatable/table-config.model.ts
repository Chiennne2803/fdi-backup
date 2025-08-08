import { IColumnData } from './column-data.model';
import { IDisplayColumn } from './display-column.model';

export interface IFilterBy {
    filterKey: string;
    condition: string | boolean;
}

export interface IFooterTable {
    label?: string;
    value?: number;
    type?: 'VND' | 'EU' | '$';
    note?: string;
}

export interface ITableConfig {
    columnDefinition: Array<IDisplayColumn>;
    pagination?: IColumnData;
    title?: string;
    stickyHeader?: boolean;
    filterBy?: Array<IFilterBy>;
    expandable?: boolean;
    isDialog?: boolean;
    noScroll?: boolean;
    footerTable?: Array<IFooterTable>;
    isViewDetail?: boolean;
    key?: string;
    showFooter?: boolean;
    displayScollX?: boolean;
}

export class TableConfig implements ITableConfig {
    public constructor(
        public columnDefinition: Array<IDisplayColumn>,
        public pagination: IColumnData,
        public title?: string,
        public stickyHeader?: boolean,
        public filterBy?: Array<IFilterBy>,
        public expandable?: boolean,
        public isDialog?: boolean,
        public noScroll?: boolean,
        public footerTable?: Array<IFooterTable>,
        public isViewDetail?: boolean
    ) { }
}


export class ButtonTableEvent {
    constructor(
        public action: 'view' |'add' | 'lock' | 'unlock' | 'edit' | 'export' | 'search' | 'dialog-search' | 'cancel'
            | 'payment' | 'deleted' | 'update-rate' | 'advanced-search' | 'approve' | 'sign-process',
        public rowItem?: object,
        public data?: object[],
    ) { }
}
