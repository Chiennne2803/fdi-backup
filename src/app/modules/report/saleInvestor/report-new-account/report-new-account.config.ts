import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('fullName', 'Nhà đầu tư', 25, false),
        new TextColumn('admAccountId', 'ID', 25, false),
        new TextColumn('lastUpdatedDate', 'Thời gian mở', 25, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('amount', 'Nạp tiền', 25, false, 1),
        new TextColumn('manageStaffName', 'Nhân viên quản lý', 25, false),
    ]
};

export const TASK_BAR_STATISTICAL_REPORT_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
    },
    otherBtn: [
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};
