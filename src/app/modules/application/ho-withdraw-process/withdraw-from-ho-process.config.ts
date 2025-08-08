import { CheckboxColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const TABLE_WITHDRAW_HO_PROCESS_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transCode', 'Mã yêu cầu', 30, true),
        new TextColumn('amount', 'Số tiền rút', 30, false, 3, false, true),
        new TextColumn('createdDate', 'Ngày lập', 30, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 30),
    ],
    title: 'Danh sách yêu cầu rút tiền từ tài khoản HO',
    isViewDetail: false
};

export const TASK_BAR_CONFIG_WITHDRAW_HO_PROCESS: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true)
};

export const TABLE_BUTTON_ACTION_CONFIG_WITHDRAW_HO_PROCESS: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_PROCESSING_WALLET_EXPORT', fileName : 'Xu_ly_yeu_cau_rut_tien_vi_tu_tai_khoan_HO'},
    ],
};
