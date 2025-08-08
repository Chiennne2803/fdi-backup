import {ITableConfig} from '../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../shared/models/datatable/display-column.model';
import {ButtonConfig, DataTableButtonConfig, TaskBarConfig} from '../../../shared/models/datatable/task-bar.model';

export const TABLE_INVESTOR_INVESTING_CONFIG_ERROR: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('transCode', 'Mã giao dịch', 20, true),
        new TextColumn('amount', 'Số tiền nạp', 15, false,1),
        new TextColumn('transDate', 'Thời gian giao dịch', 20, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('statusName', 'Trạng thái', 20, false),

    ],
    title: 'Danh sách giao dịch lỗi',isViewDetail: false,
    footerTable: [{
        label: 'Tổng tiền:',
        value: 0,
        type: 'VND'
    }]
};

export const TASK_BAR_CONFIG_ERROR: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
    }
};

export const TABLE_BUTTON_ACTION_ERROR_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_RECHARGE_TRANSACTION_EXPORT', fileName : 'Danh_sach_giao_dich_nap_tien'},
    ],
};

export const TABLE_INVESTOR_INVESTING_CONFIG_SUCCESS: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('transCode', 'Mã giao dịch', 20, true),
        new TextColumn('admAccountName', 'Người thụ hưởng', 20, false),
        new TextColumn('amount', 'Số tiền nạp', 15, false, 1),
        new TextColumn('transDate', 'Thời gian giao dịch', 20, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('statusName', 'Trạng thái', 15, false),
        new TextColumn('admAccountIdManagerName', 'Nhân viên phụ trách', 20, false),
    ],
    title: 'Danh sách giao dịch thành công',isViewDetail: false,
    footerTable: [{
        label: 'Tổng tiền:',
        value: 0,
        type: 'VND'
    }]
};

export const TASK_BAR_CONFIG_SUCCESS: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
    }
};

export const TABLE_BUTTON_ACTION_SUCCESS_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_RECHARGE_TRANSACTION_EXPORT', fileName : 'Danh_sach_giao_dich_nap_tien'},
    ],
};

