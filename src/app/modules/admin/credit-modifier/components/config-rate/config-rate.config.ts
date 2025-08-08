import { CheckboxColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { ButtonConfig, DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const TABLE_RATE_TENURE_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('creditCode', 'Xếp hạng khách hàng', 20, true),
        new TextColumn('tenor', 'Kỳ hạn (Ngày)', 10, false, 3),
        new TextColumn('mortgateRateRange', 'Lãi suất vay thế chấp(%)', 15, false),
        new TextColumn('creditRateAdd', 'Lãi suất vay tín chấp cộng thêm(%)', 15, false),
        new TextColumn('fee', 'Phí(%)', 10, false, 3),
        // new TextColumn('periodPay', 'Số lượng kỳ thanh toán', 5, false, 3),
        new TextColumn('createdDate', 'Ngày tạo', 15, false, 'DD/MM/YYYY'),
        new TextColumn('createdByName', 'Người tạo', 15),
        new TextColumn('lastUpdatedDate', 'Ngày cập nhật', 15, false, 'DD/MM/YYYY'),
        new TextColumn('lastUpdatedByName', 'Người cập nhật', 15),
    ],
    title: 'Quản lý lãi suất và kỳ hạn huy động vốn',
    isViewDetail: false
};

export const TASK_BAR_CONFIG_RATE_TENURE: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('SFF_CUSTOM_CREDIT_PRODUCTS_INSERT', true, false, 'Thêm', 'feather:plus-circle', 'add'),
        new ButtonConfig('SFF_CUSTOM_CREDIT_PRODUCTS_UPDATE', true, false, 'Cập nhật lãi suất vay tín chấp', 'heroicons_outline:cog', 'update-rate'),
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG_RATE_TENURE: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_CUSTOM_CREDIT_PRODUCTS_EXPORT', fileName : 'Tuy_chinh_san_pham_tin_dung'},
    ],
};
