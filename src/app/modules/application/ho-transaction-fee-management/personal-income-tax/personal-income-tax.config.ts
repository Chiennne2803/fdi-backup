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
        {type: 'export', role: 'SFF_REQUEST_FUNDING_EXPORT', fileName : 'Thue_thu_nhap_Ca_nhan'},
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

export const TABLE_PERSONAL_INCOME_TAX_REQUEST: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transCode', 'Mã yêu cầu', 10, true),
        new TextColumn('amount', 'Số tiền', 10, false, 1),
        new TextColumn('createdDate', 'Ngày lập', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('statusName', 'Trạng thái', 10, false),
    ],
    title: 'Yêu cầu điều chuyển ví', isViewDetail: false
};

export const TABLE_PERSONAL_INCOME_TAX_LIST: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transDate', 'Ngày giao dịch', 20, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('fsLoanProfilesId', 'Hồ sơ đã đầu tư', 10, false),
        new TextColumn('admAccountIdPresenterName', 'Khách hàng', 20, false),
        new TextColumn('amount', 'Tiền thuế TNCN (VND)', 20, false, 1),
        new TextColumn('originOfTransactionName', 'Loại', 20, false),
    ],
    title: 'Danh sách giao dịch', isViewDetail: false
};
