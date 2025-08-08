import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, DataTableButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_BUTTON_ACTION_CONFIG_REQUEST: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_REQUEST_FUNDING_EXPORT'},
        {type : 'lock', role : 'SFF_REQUEST_FUNDING_DELETE', label : 'Xóa'},
    ],
};

export const TABLE_BUTTON_ACTION_CONFIG_LIST: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_REQUEST_FUNDING_EXPORT', fileName : 'Phi_ket_noi'},
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

export const TABLE_FEE_INVESTMENT_TRANSACTION_REQUEST: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transCode', 'Mã yêu cầu', 10, true),
        new TextColumn('amount', 'Số tiền rút', 10, false, 1),
        new TextColumn('createdDate', 'Ngày lập', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('statusName', 'Trạng thái', 10, false),
    ],
    title: 'Yêu cầu điều chuyển ví',isViewDetail: false
};

export const TABLE_FEE_INVESTMENT_TRANSACTION_LIST: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transDate', 'Ngày ghi nhận', 25, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('admAccountIdPresenterName', 'Nhà đầu tư', 10, false),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 20, false),
        new TextColumn('amount', 'Phí(VNĐ)', 20, false, 1),
    ],
    title: 'Danh sách giao dịch', isViewDetail: false
};
