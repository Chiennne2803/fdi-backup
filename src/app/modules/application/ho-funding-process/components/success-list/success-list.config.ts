import { FUNDING_TYPE_STATUS_TEXT_MAP } from 'app/enum';
import { BaseResponse } from 'app/models/base';
import { CheckboxColumn, StatusColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const TABLE_SUCCESS_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('transCode', 'Mã yêu cầu', 20, true),
        new TextColumn('transTypeName', 'Loại yêu cầu', 15),
        new TextColumn('amount', 'Số tiền tiếp quỹ', 15, false, 3),
        new TextColumn('createdDate', 'Ngày lập', 10, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 10),
        new TextColumn('note', 'Ghi chú', 10),
    ],
    title: 'Danh sách đã phê duyệt',
    isViewDetail: false
};

export const TASK_BAR_CONFIG_SUCCESS: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true)
};

export const TABLE_BUTTON_ACTION_CONFIG_SUCCESS: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_PROCESSING_FUNDING_EXPORT', fileName : 'Thanh_cong'},
    ],
};
