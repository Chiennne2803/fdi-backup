export interface IBaseModel {
    errorCode: number;
    message: string;
    paramMessage: string;
    payload: any;
};

export interface IBaseDataSourceObj {
    admCategoriesId: number;
    categoriesCode: string;
    categoriesName: string;
    createdBy: number;
    createdByName: string;
    createdDate: number;
    lastUpdatedBy: number;
    lastUpdatedByName: string;
    lastUpdatedDate: number;
    parentId: number;
    status: number;
    value: string;
};
