import {CheckboxColumn, IndexColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {ITableConfig} from 'app/shared/models/datatable/table-config.model';

export const TABLE_ACTION_DETAIL_CONFIG: ITableConfig = {
    columnDefinition: [
        new TextColumn('admActionDetailId', 'ID bản ghi', 8, false),
        new TextColumn('colName', 'Trường thông tin', 15, false),
        new TextColumn('oldValue', 'Dữ liệu cũ', 15, false),
        new TextColumn('newValue', 'Dữ liệu mới', 15, false)
    ], isViewDetail: false,
    title: 'Xem chi tiết lịch sử tác động'
};
