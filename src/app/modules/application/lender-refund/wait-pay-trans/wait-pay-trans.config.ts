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
        new ButtonConfig('', true, false, 'Lập yêu cầu', 'feather:plus-circle', 'add'),
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const TABLE_WAIT_PAY_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 10),
        new TextColumn('transCode', 'Mã giao dịch', 20, true),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ huy động vốn', 20),
        new TextColumn('admAccountName', 'Bên huy động vốn', 20),
        new TextColumn('paidBankAmount', 'Tổng số tiền thanh toán (VNĐ)', 20, false, 3),
        new TextColumn('createdByName', 'Người lập', 20),
        new TextColumn('statusName', 'Trạng thái', 20),
    ],
    title: 'Giao dịch chờ thanh toán',
    isViewDetail: false
};

export const TABLE_BUTTON_WAIT_PAY_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        {type: 'export', role: 'SFF_REFUND_TRANSACTION_EXPORT', fileName : 'Xu_ly_giao_dich_hoan_tra_khoan_huy_dong'},
        // {type: 'lock', role: 'SFF_REQUEST_FUNDING_DELETE', label: 'Xóa'},
    ],
};

