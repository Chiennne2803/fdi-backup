import { BORROWER_INVESTOR_STATUS_COLOR_MAP, UserType } from 'app/enum';
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

export const TABLE_BORROWER_MANAGEMENT_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('admAccountId', 'ID tài khoản', 10, true),
        new TextColumn('accountName', 'Tên tài khoản', 10, true),
        new TextColumn('fullName', 'Bên huy động vốn', 20),
        new TextColumn('mobile', 'SĐT liên hệ', 10),
        new TextColumn('email', 'Email', 10),
        new TextColumn('identification', 'Số CCCD/Hộ chiếu', 10),
        new TextColumn('businessLicense', 'Số giấy phép kinh doanh', 10),
        new TextColumn('taxCode', 'Mã số thuế', 10),
        new StatusColumn('type', 'Đối tượng', 10, TYPE_TEXT_MAP),
        new TextColorColumn('statusName', 'Trạng thái xác minh', 10, 'status', BORROWER_INVESTOR_STATUS_COLOR_MAP),
        new TextColumn('accountStatusName', 'Trạng thái tài khoản', 10),
        // new TextColumn('presenter', 'Người giới thiệu', 20),
        new TextColumn('manageStaffName', 'Nhân viên phụ trách', 20),
        // new TextColumn('guide', 'Nhân viên giới thiệu', 20),
        // new TextColumn('reviewer', 'Người phê duyệt', 20),
        new TextColumn('createdByName', 'Người tạo', 20),
        new TextColumn('createdDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY'),
    ],
    title: 'Quản lý bên huy động vốn', isViewDetail: false
};

export const TASK_BAR_BORROWER_MANAGEMENT_CONFIG: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('SFF_BORROWER_INSERT', true, false, 'Thêm', 'feather:plus-circle', 'add'),
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        { type: 'lock', role: 'SFF_BORROWER_UPDATE' },
        { type: 'unlock', role: 'SFF_BORROWER_UPDATE' },
        { type: 'export', role: 'SFF_BORROWER_EXPORT', fileName: 'Danh_sach_nguoi_huy_dong_von' },
    ],
    otherBtn: [
        new ButtonConfig('SFF_BORROWER_UPDATE', false, true, 'Phê duyệt', 'mat_outline:playlist_add_check', 'approve'),
        new ButtonConfig(null, false, true, 'Phân quản lý', 'mat_outline:playlist_add_check', 'update-rate')
    ]
};

