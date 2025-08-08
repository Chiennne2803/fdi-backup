import {
    ButtonActionColumn,
    CheckboxColumn,
    IndexColumn,
    TextColumn
} from 'app/shared/models/datatable/display-column.model';
import {ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {
    ButtonConfig,
    DataTableButtonConfig,
    SearchBar,
    TaskBarConfig
} from "../../../shared/models/datatable/task-bar.model";


export const TABLE_ACCOUNT_CONFIG: ITableConfig = {
    columnDefinition: [
        // new CheckboxColumn(),
        new IndexColumn('no', 'STT', 8),
        new TextColumn('admDepartmentsCode', 'Mã phòng ban', 20, true),
        new TextColumn('departmentName', 'Tên phòng ban', 20),
        new TextColumn('fullName', 'Trưởng phòng ban', 20),
        new TextColumn('createdByName', 'Người tạo', 10),
        new TextColumn('createdDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('lastUpdatedDate', 'Ngày Cập nhật', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('lastUpdatedByName', 'Người cập nhật', 15),
        // new ButtonActionColumn('action', 'Hành động', 'primary', 'Cập nhật')
    ],
    title: 'Thông tin phòng ban',
    isViewDetail: false
};
export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('SFF_DEPARTMENT_INSERT', true, false, 'Thêm phòng ban', 'feather:plus-circle', 'add'),
    ]
};
export const TABLE_BUTTON_ACTION_CONFIG: DataTableButtonConfig = {
        commonBtn: [
        {type : 'export', role : 'SFF_DEPARTMENT_EXPORT'},
    ],
};
