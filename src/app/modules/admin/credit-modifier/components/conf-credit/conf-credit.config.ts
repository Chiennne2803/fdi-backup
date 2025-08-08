import { CheckboxColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { ButtonConfig, DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const TABLE_RANKS_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('creditCode', 'Xếp hạng khách hàng', 20, true),
        new TextColumn('minValue', 'Điểm tối thiểu', 20, false, 3),
        new TextColumn('maxValue', 'Điểm tối đa', 15, false, 3),
        new TextColumn('createdDate', 'Ngày tạo', 15, false, 'DD/MM/YYYY'),
        new TextColumn('createdByName', 'Người tạo', 15),
        new TextColumn('lastUpdatedDate', 'Ngày cập nhật', 15, false, 'DD/MM/YYYY'),
        new TextColumn('lastUpdatedByName', 'Người cập nhật', 15),
    ],
    title: 'Quản lý hạn mức xếp hạng tín dụng',
    isViewDetail: false
};

export const TASK_BAR_CONFIG_RANKS: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('SFF_CUSTOM_CREDIT_PRODUCTS_INSERT', true, false, 'Thêm', 'feather:plus-circle', 'add'),
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG_RANKS: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_CUSTOM_CREDIT_PRODUCTS_EXPORT', fileName : 'Tuy_chinh_san_pham_tin_dung'},
        {type : 'edit', label: 'Xét phân hạng mặc định', role : 'SFF_CUSTOM_CREDIT_PRODUCTS_UPDATE'},
    ],
};
