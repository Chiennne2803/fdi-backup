import { BaseResponse } from 'app/models/base';
import { CheckboxColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const TABLE_COMMISSION_PROCESS_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transCode', 'Mã yêu cầu', 20, true),
        new TextColumn('amount', 'Số tiền rút', 15, false, 3),
        new TextColumn('createdDate', 'Ngày lập', 10, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 10),
    ],
    title: 'Danh sách giao dịch yêu cầu thanh toán hoa hồng', isViewDetail: false
};

export const TASK_BAR_CONFIG_COMMISSION_PROCESS: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true)
};

export const TABLE_BUTTON_ACTION_CONFIG_COMMISSION_PROCESS: DataTableButtonConfig = {
    commonBtn: [{type : 'export', role : 'SFF_TRANSFER_REQUESTS_EXPORT', fileName : 'Xu_ly_giao_dich_thanh_toan_hoa_hong'}]
};

