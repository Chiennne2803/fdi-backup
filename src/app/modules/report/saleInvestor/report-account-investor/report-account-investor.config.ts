import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, SearchBar, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('fullName', 'Nhà đầu tư', 10, false),
        new TextColumn('admAccountId', 'ID', 10, false),
        new TextColumn('transDate', 'Thời gian', 10, false, 'DD/MM/YYYY'),
        new TextColumn('topupAmount', 'Nạp tiền', 10, false, 1),
        new TextColumn('withdrawAmount', 'Rút tiền', 10, false, 1),
        new TextColumn('investAmount', 'Đầu tư', 10, false, 1),
        new TextColumn('weu', 'Số dư khả dụng', 10, false, 1),
        new TextColumn('manageStaffName', 'Nhân viên quản lý', 10, false),
    ],
    title: '',isViewDetail: false
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
