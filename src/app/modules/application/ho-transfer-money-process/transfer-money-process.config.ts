import { CheckboxColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const TABLE_TRANSFER_MONEY_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transCode', 'Mã yêu cầu', 20, true),
        new TextColumn('amount', 'Số tiền rút', 15, false, 3),
        new TextColumn('createdDate', 'Ngày lập', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('statusName', 'Trạng thái', 10),
    ],
    title: 'Danh sách yêu cầu điều chuyển ví',
    isViewDetail: false
};

export const TASK_BAR_CONFIG_TRANSFER_MONEY: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true)
};

export const TABLE_BUTTON_ACTION_CONFIG_TRANSFER_MONEY: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_TRANSFER_REQUESTS_EXPORT', fileName : 'Phi_thu_xep_khoan_vay'},
    ],
};
