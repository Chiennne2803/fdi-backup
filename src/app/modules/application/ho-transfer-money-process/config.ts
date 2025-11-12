import {CheckboxColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {ITableConfig} from 'app/shared/models/datatable/table-config.model';

export const TABLE_CONFIG_LOAN: ITableConfig = {
    columnDefinition: [
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 15, false),
        new TextColumn('admAccountIdPresenterName', 'Khách hàng', 30, false),
        new TextColumn('amount', 'Phí kết nối huy động vốn (VND)', 15, false, 3),
    ],
    title: 'Danh sách giao dịch điều chuyển',
    isViewDetail: false
};

export const TABLE_CONFIG_ACCOUNT: ITableConfig = {
    columnDefinition: [
        new TextColumn('admAccountIdPresenterName', 'Khách hàng', 30, false),
        new TextColumn('transactionCode', 'Giao dịch thu phí', 15, false),
        new TextColumn('amount', 'Phí giao dịch (VND)', 15, false, 3),
    ],
    title: 'Danh sách giao dịch điều chuyển',
    isViewDetail: false

};

export const TABLE_CONFIG_TRANSFER_FEE: ITableConfig = {
    columnDefinition: [
        new TextColumn('admAccountIdPresenterName', 'Khách hàng', 30, false),
        new TextColumn('transactionCode', 'Giao dịch thu phí', 15, false),
        new TextColumn('amount', 'Phí giao dịch (VND)', 15, false, 3),
    ],
    title: 'Danh sách giao dịch điều chuyển',
    isViewDetail: false
};

export const TABLE_CONFIG_INVESTMENT: ITableConfig = {
    columnDefinition: [
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 15, false),
        new TextColumn('admAccountIdPresenterName', 'Khách hàng', 30, false),
        new TextColumn('amount', 'Phí giao dịch (VND)', 15, false, 3),
    ],
    title: 'Danh sách giao dịch điều chuyển',
    isViewDetail: false
};

export const TABLE_CONFIG_DEPOSIT: ITableConfig = {
    columnDefinition: [
        new TextColumn('admAccountIdPresenterName', 'Khách hàng', 30, false),
        new TextColumn('transactionCode', 'Giao dịch nạp tiền', 15, false),
        new TextColumn('amount', 'Phí giao dịch (VND)', 15, false, 3),
    ],
    title: 'Danh sách giao dịch điều chuyển',
    isViewDetail: false
};

export const TABLE_CONFIG_WITHDRAW: ITableConfig = {
    columnDefinition: [
        new TextColumn('admAccountIdPresenterName', 'Khách hàng', 30, false),
        new TextColumn('transactionCode', 'Giao dịch rút tiền', 15, false),
        new TextColumn('amount', 'Phí giao dịch (VND)', 15, false, 3),
    ],
    title: 'Danh sách giao dịch điều chuyển',
    isViewDetail: false
};

export const TABLE_CONFIG_PERSONAL_INCOME: ITableConfig = {
    columnDefinition: [
        new TextColumn('admAccountIdPresenterName', 'Khách hàng', 30, false),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 15, false),
        new TextColumn('amount', 'Thuế TNCN (VND)', 15, false, 3),
        new TextColumn('originOfTransactionName', 'Loại', 15, false),
    ],
    title: 'Danh sách giao dịch điều chuyển',
    isViewDetail: false
};

export const TABLE_CONFIG_OVERDUE: ITableConfig = {
    columnDefinition: [
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ huy động vốn ', 15, false),
        new TextColumn('admAccountIdPresenterName', 'Khách hàng', 30, false),
        new TextColumn('transactionCode', 'Yêu cầu thanh toán khoản vay', 15, false),
        new TextColumn('amount', 'Lãi quá hạn (VND)', 15, false, 3),
    ],
    title: 'Danh sách giao dịch điều chuyển',
    isViewDetail: false
};
