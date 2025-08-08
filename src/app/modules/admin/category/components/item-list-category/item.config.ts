import {CheckboxColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {
    ButtonConfig,
    DataTableButtonConfig,
    SearchBar,
    TaskBarConfig
} from 'app/shared/models/datatable/task-bar.model';

export const TABLE_CATEGORY_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('categoriesCode', 'Mã ', 20, true),
        new TextColumn('categoriesName', 'Tên ', 20),
        new TextColumn('value', 'Giá trị', 15),
        new TextColumn('statusName', 'Trạng thái', 15),
        new TextColumn('createdByName', 'Người tạo', 15),
        new TextColumn('lastUpdatedDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY'),
    ],
    title: 'Danh sách danh mục',
    isViewDetail: false
};

export const TASK_BAR_CATEGORY_CONFIG: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', false),
    otherBtn: [
        new ButtonConfig('SFF_DIRECTORY_DATA_INSERT', true, false, 'Thêm', 'feather:plus-circle', 'add'),
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG_CATEGORY: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_DIRECTORY_DATA_EXPORT'},
        // {type : 'lock', role : 'SFF_DIRECTORY_DATA_DELETE'},
        // {type : 'unlock', role : 'SFF_DIRECTORY_DATA_UPDATE'},
        {type : 'edit', role : 'SFF_DIRECTORY_DATA_UPDATE'},
    ],
};

