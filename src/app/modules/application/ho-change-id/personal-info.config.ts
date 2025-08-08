import {CHANGE_ID_STATUS_TEXT_MAP, USER_INFO_TYPE_REQ, USER_TYPE_STATUS_TEXT_MAP} from 'app/enum';
import { CheckboxColumn, StatusColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { ButtonConfig, DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const TABLE_PERSONAL_INFO_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transCode', 'Mã yêu cầu', 15, true),
        new TextColumn('typeName', 'Loại yêu cầu', 20),
        new TextColumn('createdByName', 'Người yêu cầu', 10),
        new TextColumn('createdDate', 'Ngày yêu cầu', 10, false, 'DD/MM/YYYY'),
        new TextColumn('approvalByName', 'Người xử lý', 10),
        new TextColumn('approvalDate', 'Ngày xử lý', 10, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 10),
    ],
    title: 'Danh sách yêu cầu thay đổi thông tin khách hàng',
    isViewDetail: false
};

export const TASK_BAR_CONFIG_PERSONAL_INFO: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG_PERSONAL_INFO: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_CHANGE_ID_EXPORT'},
    ],
    otherBtn: [
        new ButtonConfig('SFF_CHANGE_ID_APPROVE', false, true, 'Phê duyệt', 'mat_outline:playlist_add_check', 'approve')
    ]
};
