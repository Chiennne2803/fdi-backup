import {CheckboxColumn, IndexColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {
    ButtonConfig,
    DataTableButtonConfig,
    SearchBar,
    TaskBarConfig
} from 'app/shared/models/datatable/task-bar.model';


export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const TABLE_ERROR_TRANS_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 10),
        new TextColumn('info', 'Mã giao dịch', 30, true),
        new TextColumn('amount', 'Số tiền chuyển khoản (VNĐ)', 15, false, 3),
        new TextColumn('createdDate', 'Ngày chuyển tiền', 15, false, 'DD/MM/YYYY hh:mm:ss'),
        new TextColumn('statusName', 'Trạng thái', 30),
    ],
    title: 'Giao dịch lỗi',
    isViewDetail: false
};

export const TABLE_BUTTON_ERROR_TRANS_CONFIG: DataTableButtonConfig = {
    commonBtn: [{type : 'export', role : 'SFF_REFUND_TRANSACTION_EXPORT', fileName : 'Xu_ly_giao_dich_hoan_tra_khoan_huy_dong'}],
};



