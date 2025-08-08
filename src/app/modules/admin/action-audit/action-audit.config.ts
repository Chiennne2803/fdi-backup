import {ITableConfig} from '../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../shared/models/datatable/display-column.model';
import {ButtonConfig, DataTableButtonConfig, TaskBarConfig} from '../../../shared/models/datatable/task-bar.model';

export const TABLE_ACTION_AUDIT_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('admAccountName', 'Tên tài khoản', 15, true),
        new TextColumn('ip', 'Địa chỉ IP', 15, false),
        new TextColumn('device', 'Thiết bị', 15, false),
        new TextColumn('os', 'Hệ điều hành', 15, false),
        new TextColumn('browser', 'Trình duyệt sử dụng', 15, false),
        new TextColumn('loginTime', 'Đăng nhập lần cuối', 15, false, 'DD/MM/YYYY HH:mm:ss'),
    ],
    title: 'Danh sách giao dịch thành công',isViewDetail: false
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
    }
};

export const TABLE_BUTTON_ACTION_CONFIG: DataTableButtonConfig = {
    commonBtn: [{type : 'export', role : ''}],
};

