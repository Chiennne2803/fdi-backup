import {CheckboxColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {
    ButtonConfig,
    DataTableButtonConfig,
    SearchBar,
    TaskBarConfig
} from 'app/shared/models/datatable/task-bar.model';

export const TABLE_WITHDRAW_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transCode', 'Mã yêu cầu', 30, true),
        new TextColumn('amount', 'Số tiền rút', 15, false, 3),
        new TextColumn('createdDate', 'Ngày lập', 15, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 15),
    ],
    title: 'Danh sách yêu cầu rút tiền ví từ tài khoản HO', isViewDetail: false
};

export const TASK_BAR_CONFIG_WITHDRAW: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('SFF_WITHDRAW_WALLET_INSERT', true, false, 'Lập yêu cầu', '', 'add'),
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG_WITHDRAW: DataTableButtonConfig = {
    commonBtn: [
        {type: 'export', role: 'SFF_WITHDRAW_WALLET_EXPORT'}
    ],
    otherBtn: [
        new ButtonConfig('SFF_WITHDRAW_WALLET_DELETE',
            true,
            false,
            'Xoá',
            'heroicons_outline:trash',
            'deleted'),
    ]
};
