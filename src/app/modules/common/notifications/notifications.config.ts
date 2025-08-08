import { TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';


export const TABLE_ACCOUNT_CONFIG: ITableConfig = {
    columnDefinition: [
        new TextColumn('title', 'Tiêu đề', 20, true),
        new TextColumn('createdDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY HH:mm:ss'),
    ],
    title: 'Thông báo',
    isViewDetail: false
};
