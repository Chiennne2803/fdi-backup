import {ITableConfig} from '../../shared/models/datatable/table-config.model';
import {CheckboxColumn, TextColumn} from '../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('admAccountIdRecive', 'Mã nhà đầu tư', 10, false),
        new TextColumn('admAccountIdReciveName', 'Tên cá nhân / doanh nghiệp', 20, false),
        new TextColumn('amount', 'Số tiền', 10, false, 1),
        new TextColumn('createdDate', 'Ngày lập giao dịch', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('lastUpdatedDate', 'Ngày ghi nhận', 10, false, 'DD/MM/YYYY HH:mm:ss'),
    ],
    title: '',isViewDetail: false,
    footerTable: [{
        label: '',
        value: 0,
        type: 'VND',
        note: '*Tổng số tiền trên các trang danh sách'
    }]
};


export const TABLE_STATISTICAL_REPORT_INVESTOR_WITHDRAWAL_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('admAccountIdRecipient', 'Mã nhà đầu tư', 10, false),
        new TextColumn('admAccountIdRecipientName', 'Tên cá nhân / doanh nghiệp', 10, false),
        new TextColumn('amount', 'Số tiền', 10, false, 1),
        new TextColumn('createdDate', 'Ngày yêu cầu', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('lastUpdatedDate', 'Ngày ghi nhận', 10, false, 'DD/MM/YYYY HH:mm:ss'),
    ],
    title: '',isViewDetail: false,
    footerTable: [{
        label: '',
        value: 0,
        type: 'VND',
        note: '*Tổng số tiền trên các trang danh sách'
    }]
};

export const TABLE_STATISTICAL_REPORT_BUSINESS_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, false),
        new TextColumn('lenderName', 'Tên cá nhân / doanh nghiệp', 15, true),
        new TextColumn('amount', 'Gốc', 10, false, 1),
        new TextColumn('interest', 'Lãi', 10, false, 1),
        new TextColumn('overdueAmount', 'Phạt trả chậm', 10, false, 1),
        new TextColumn('paidAmount', 'Số tiền hoàn trả', 10, false, 1),
        new TextColumn('paidDate', 'Ngày hoàn trả', 15, true, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('transDate', 'Ngày ghi nhận', 15, undefined, 'DD/MM/YYYY HH:mm:ss'),
    ],
    title: 'Báo cáo hoàn trả của doanh nghiệp',isViewDetail: false,
    footerTable: [{
        label: 'Tổng số tiền hoàn trả:',
        value: 0,
        type: 'VND',
        note: '*Tổng số tiền trên các trang danh sách'
    }]
};

export const TASK_BAR_STATISTICAL_REPORT_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
    }
};
