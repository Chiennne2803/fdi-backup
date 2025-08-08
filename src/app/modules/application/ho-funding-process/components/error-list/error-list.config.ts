import { CheckboxColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const TABLE_ERROR_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('info', 'Nội dung chuyển tiền', 25, true),
        new TextColumn('amount', 'Số tiền', 25, false, 3),
        new TextColumn('transDate', 'Ngày giao dịch', 25, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 25),
    ],
    title: 'Danh sách lỗi',
    isViewDetail: false
};

export const TASK_BAR_CONFIG_ERROR: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true)
};

export const TABLE_BUTTON_ACTION_CONFIG_ERROR: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_PROCESSING_FUNDING_EXPORT', fileName : 'Giao_dich_loi'},
    ],
};

