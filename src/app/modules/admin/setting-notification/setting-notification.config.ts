import { Status } from 'app/enum';
import {
    CheckboxColumn,
    CheckedColumn,
    IndexColumn,
    StatusColumn,
    TextColumn
} from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { ButtonConfig, DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const STATUS_NOTIFICATION_TEXT_MAP = {
    [Status.ACTIVE]: 'Hoạt động',
    [Status.INACTIVE]: 'Không hoạt động'
};

export const TABLE_SETTING_NOTI_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 8),
        new TextColumn('configName', 'Tên thông báo', 15, true),
        new CheckedColumn('sendNotify', 'Thông báo hệ thống', 10),
        new CheckedColumn('sendEmail', 'Thông báo email', 10),
        new TextColumn('createdByName', 'Người tạo', 15),
        new TextColumn('createdDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY'),
        new TextColumn('lastUpdatedByName', 'Người cập nhật', 15),
        new TextColumn('lastUpdatedDate', 'Ngày cập nhật', 10, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 10),
    ],
    title: 'Danh sách thông báo',
    isViewDetail: false
};

export const TASK_BAR_CONFIG_SETTING_NOTI: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('SFF_CONFIGURING_ALERTS_INSERT', true, false, 'Thêm', 'feather:plus-circle', 'add'),
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG_SETTING_NOTI: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_CONFIGURING_ALERTS_EXPORT'},
        {type : 'edit', role : 'SFF_CONFIGURING_ALERTS_UPDATE'},
    ],
    otherBtn: [
        new ButtonConfig('SFF_CONFIGURING_ALERTS_DELETE', false, true, 'Xoá', 'heroicons_outline:trash', 'deleted')
    ]
};


