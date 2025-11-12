import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, DataTableButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_BUTTON_ACTION_CONFIG_REQUEST: DataTableButtonConfig = {
    commonBtn: [
        {type: 'export', role: 'SFF_REQUEST_FUNDING_EXPORT'},
        {type : 'lock', role : 'SFF_REQUEST_FUNDING_DELETE', label : 'Xóa'},
    ],
};

export const TABLE_BUTTON_ACTION_CONFIG_LIST: DataTableButtonConfig = {
    commonBtn: [
        {type: 'export', role: 'SFF_REQUEST_FUNDING_EXPORT', fileName : 'Lai_qua_han'},
    ],
    otherBtn: [
        new ButtonConfig(
            '',
            true,
            false,
            'Điều chuyển tiền ví',
            'create',
            'add',
            'basic',
            'mat-icon-button'
        ),
    ]
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
    }
};

export const TABLE_OVERDUE_INTEREST_REQUEST: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transCode', 'Mã yêu cầu', 25, true),
        new TextColumn('amount', 'Số tiền', 25, false, 1),
        new TextColumn('createdDate', 'Ngày lập', 25, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('statusName', 'Trạng thái', 25, false),
    ],
    title: 'Yêu cầu điều chuyển ví', isViewDetail: false
};

export const TABLE_OVERDUE_INTEREST_LIST: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transDate', 'Ngày ghi nhận', 25, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('fsLoanProfilesId', 'Hồ sơ huy động vốn', 25, false),
        new TextColumn('admAccountIdPresenterName', 'Khách hàng', 25, false),
        new TextColumn('transactionCode', 'Yêu cầu thanh toán khoản vay', 25, false),
        new TextColumn('amount', 'Lãi quá hạn (VND)', 25, false, 1),
    ],
    title: 'Danh sách giao dịch', isViewDetail: false
};

