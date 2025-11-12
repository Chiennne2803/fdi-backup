import { CheckboxColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { ButtonConfig, DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const TABLE_REQ_PAYMENT_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transCode', 'Mã yêu cầu', 20, true),
        new TextColumn('amount', 'Tiền hoa hồng (VND)', 15, false, 3),
        new TextColumn('createdDate', 'Ngày lập', 15, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 10),
    ],
    title: 'Danh sách giao dịch', isViewDetail: false
};

export const TASK_BAR_CONFIG_REQ_PAYMENT: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true)
};

export const TABLE_BUTTON_ACTION_CONFIG_REQ_PAYMENT: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_COMMISSION_PAYMENT_EXPORT'},
    ],
    otherBtn: [
        new ButtonConfig('SFF_COMMISSION_PAYMENT_DELETE', true, false, 'Xoá', 'heroicons_outline:trash', 'deleted'),
    ]
};
