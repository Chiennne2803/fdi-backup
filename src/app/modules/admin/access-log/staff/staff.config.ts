import { CheckboxColumn, IndexColumn, StatusColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import {
    ButtonConfig,
    DataTableButtonConfig,
    SearchBar,
    TaskBarConfig
} from 'app/shared/models/datatable/task-bar.model';

export const TABLE_INVESTOR_TRANSPAY_REQ_DRAFT_CONFIG: ITableConfig = {
        columnDefinition: [
            new CheckboxColumn(),
            new IndexColumn('no', 'STT', 4),
            new TextColumn('admAccountName', 'Tên tài khoản', 15, true),
            new TextColumn('ip', 'Địa chỉ IP', 15, false),
            new TextColumn('device', 'Thiết bị', 15, false),
            new TextColumn('os', 'Hệ điều hành', 15, false),
            new TextColumn('browser', 'Trình duyệt sử dụng', 15, false),
            new TextColumn('loginTime', 'Đăng nhập lần cuối', 15, false, 'DD/MM/YYYY HH:mm:ss'),
        ]
    , isViewDetail: false,
    title: 'Giám sát truy cập'
};

export const TASK_BAR_TRANSPAY_REQ_DRAFT_CONFIG: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const TABLE_BUTTON_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_ACCESS_MONITORING_export', fileName : 'Danh_sach_tai_khoan'},
    ],
};
