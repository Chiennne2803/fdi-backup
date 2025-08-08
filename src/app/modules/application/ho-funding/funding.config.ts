import { FUNDING_TYPE_STATUS_TEXT_MAP, REQUEST_TRANSFER_TYPE_TEXT_MAP } from 'app/enum';
import { CheckboxColumn, StatusColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { ButtonConfig, DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const TABLE_FUNDING_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transCode', 'Mã yêu cầu', 20, true),
        new StatusColumn('transType', 'Loại yêu cầu', 15, FUNDING_TYPE_STATUS_TEXT_MAP),
        new TextColumn('amount', 'Số tiền tiếp quỹ', 15, false, 3),
        new TextColumn('createdDate', 'Ngày lập', 10, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 10),
    ],
    title: 'Danh sách yêu cầu tiếp quỹ tiền mặt/tiền điện tử', isViewDetail: false
};

export const TASK_BAR_CONFIG_FUNDING: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('SFF_CASH_CURRENCY_FUNDING_INSERT', true, false, 'Lập yêu cầu', '', 'add'),
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG_FUNDING: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_CASH_CURRENCY_FUNDING_EXPORT'},
    ],
    otherBtn: [
        new ButtonConfig('SFF_CASH_CURRENCY_FUNDING_DELETE', true, false, 'Xoá', 'heroicons_outline:trash', 'deleted'),
    ]
};
