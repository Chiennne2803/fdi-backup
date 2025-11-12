import {CheckboxColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {
    ButtonConfig,
    DataTableButtonConfig,
    SearchBar,
    TaskBarConfig
} from 'app/shared/models/datatable/task-bar.model';

export const TABLE_BONUS_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transTypeName', ' Giao dịch hưởng hoa hồng', 20, true),
        new TextColumn('calcMethodName', 'Hình thức tính hoa hồng', 20, false),
        new TextColumn('amount', ' Số tiền (VND)', 15, false, 3),
        new TextColumn('bonusRate', ' Tỉ lệ hoa hồng (%)', 20, false),
        new TextColumn('conditionsByName', ' Điều kiện áp dụng', 20, false),
        new TextColumn('dateBonusRange', ' Khoảng thời gian tính hoa hồng', 20, false),
        new TextColumn('statusName', ' Trạng thái', 10, false),
        new TextColumn('createdDate', 'Ngày tạo', 15, false, 'DD/MM/YYYY'),
        new TextColumn('createdByName', 'Người tạo', 20),
        new TextColumn('lastUpdatedDate', 'Ngày cập nhật', 15, false, 'DD/MM/YYYY'),
        new TextColumn('lastUpdatedByName', 'Người cập nhật', 20),
    ],
    title: 'Cấu hình hoa hồng',
    isViewDetail: false
};

export const TASK_BAR_CONFIG_BONUS: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('SFF_CUSTOM_CREDIT_PRODUCTS_INSERT', true, false, 'Thêm', 'feather:plus-circle', 'add'),
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG_BONUS: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_CUSTOM_CREDIT_PRODUCTS_EXPORT', fileName : 'Tuy_chinh_san_pham_tin_dung'},
    ],
};
