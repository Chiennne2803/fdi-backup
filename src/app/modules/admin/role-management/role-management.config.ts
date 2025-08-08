import { Status } from 'app/enum';
// import { ScreenKeyConst } from 'app/shared/constants/screen-key.const';
import { CheckboxColumn, IndexColumn, StatusColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { ButtonConfig, DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const STATUS_ROLE_TEXT_MAP = {
    [Status.ACTIVE]: 'Hoạt động',
    [Status.INACTIVE]: 'Không hoạt động'
};

export const TABLE_ROLE_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 5, false, true),
        new TextColumn('groupRoleName', 'Tên nhóm quyền', 15, true),
        new TextColumn('timeStart', 'Thời gian hiệu lực', 15, false, 'DD/MM/YYYY'),
        new TextColumn('timeEnd', 'Thời gian hết hiệu lực', 15, false, 'DD/MM/YYYY'),
        new TextColumn('createdByName', 'Người tạo', 16),
        new TextColumn('createdDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY'),
        new TextColumn('lastUpdatedByName', 'Người cập nhật', 16),
        new TextColumn('lastUpdatedDate', 'Ngày cập nhật', 10, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 10),
    ],
    title: 'Danh sách nhóm quyền',
    // key: ScreenKeyConst.DecentralizedManagement,
    isViewDetail: false
};

export const TASK_BAR_CONFIG_ROLE: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('SFF_DECENTRALIZED_INSERT', true, false, 'Thêm', 'feather:plus-circle', 'add'),
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG_ROLE: DataTableButtonConfig = {
    commonBtn: [
        {type : 'lock', role : 'SFF_DECENTRALIZED_UPDATE'},
        {type : 'unlock', role : 'SFF_DECENTRALIZED_UPDATE'},
        {type : 'edit', role : 'SFF_DECENTRALIZED_UPDATE'},
    ],

};
