import {BORROWER_INVESTOR_STATUS_COLOR_MAP, UserType} from 'app/enum';
import {
    CheckboxColumn,
    StatusColumn,
    TextColorColumn,
    TextColumn
} from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import {
    ButtonConfig,
    DataTableButtonConfig,
    SearchBar,
    TaskBarConfig
} from 'app/shared/models/datatable/task-bar.model';

export const TYPE_TEXT_MAP = {
    [UserType.DOANH_NGHIEP]: 'Doanh nghiệp',
    [UserType.CA_NHAN]: 'Cá nhân',
};

export const TABLE_INVESTOR_MANAGEMENT_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('admAccountId', 'ID tài khoản', 10, true),
        new TextColumn('accountName', 'Tên tài khoản', 10, true),
        new TextColumn('fullName', 'Tên khách hàng', 15),
        new TextColumn('mobile', 'Số điện thoại', 10),
        new TextColumn('email', 'Email', 10),
        new TextColumn('identification', 'Số CCCD/Hộ Chiếu', 10),
        new TextColumn('businessLicense', 'Số giấy phép kinh doanh', 10),
        new TextColumn('taxCode', 'Mã số thuế', 10),
        new StatusColumn('type', 'Đối tượng', 10, TYPE_TEXT_MAP),
        new TextColumn('manageStaffName', 'Người phụ trách ', 10),
        new TextColumn('createdByName', 'Người tạo', 10),
        new TextColumn('createdDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY - HH:mm:ss'),
        new TextColorColumn('statusName', 'Trạng thái xác minh', 10, 'status', BORROWER_INVESTOR_STATUS_COLOR_MAP),
        new TextColumn('accountStatusName', 'Trạng thái tài khoản', 10),
        
    ],
    title: 'Quản lý khách hàng',isViewDetail: false
};

export const TABLE_BUTTON_ACTION_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        {type : 'lock', role : 'SFF_INVESTOR_UPDATE'},
        {type : 'unlock', role : 'SFF_INVESTOR_UPDATE'},
        {type : 'export', role : 'SFF_INVESTOR_EXPORT'},
    ],
    otherBtn: [
        new ButtonConfig('SFF_INVESTOR_APPROVE', false, true, 'Phê duyệt', 'mat_outline:playlist_add_check', 'approve'),
        new ButtonConfig(null, false, true, 'Phân quản lý', 'mat_outline:playlist_add_check', 'update-rate')
    ]
};

export const TASK_BAR_INVESTOR_MANAGEMENT_CONFIG: TaskBarConfig = {
    searchBar: new SearchBar('Tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('SFF_INVESTOR_INSERT', true, false, 'Thêm', 'feather:plus-circle', 'add'),
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};
