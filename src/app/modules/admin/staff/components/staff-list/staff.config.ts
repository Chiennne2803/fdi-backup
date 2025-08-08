import { USER_STATUS_TEXT_MAP } from 'app/enum';
import {CheckboxColumn, IndexColumn, StatusColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { ButtonConfig, DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';


export const TABLE_STAFF_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 8),
        new TextColumn('fullName', 'Họ và tên', 20),
        new TextColumn('accountName', 'Tên đăng nhập', 15, true),
        new TextColumn('admDepartmentsName', 'Phòng ban', 20),
        new TextColumn('admGroupRoleName', 'Nhóm quyền', 20),
        new TextColumn('admCategoriesName', 'Chức vụ', 20),
        new TextColumn('accountStatusName', 'Trạng thái', 10),
        new TextColumn('lastLoginTime', 'Đăng nhập cuối', 20, undefined, 'DD/MM/YYYY HH:mm:ss'),
    ],
    title: 'Danh sách nhân viên',isViewDetail: false
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('SFF_EMPLOYEE_INSERT', true, false, 'Thêm nhân viên', 'feather:plus-circle', 'add'),
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG: DataTableButtonConfig = {
        commonBtn: [
        {type : 'export', role : 'SFF_EMPLOYEE_EXPORT', fileName : 'Quan_ly_nhan_vien'},
        {type : 'lock', role : 'SFF_EMPLOYEE_UPDATE'},
        {type : 'unlock', role : 'SFF_EMPLOYEE_UPDATE'},
        {type : 'edit', role : 'SFF_EMPLOYEE_UPDATE'},
    ],
};

