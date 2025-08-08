import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('fullName', 'Nhà đầu tư ', 20, false),
        new TextColumn('admAccountId', 'ID', 12.5, false),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ ', 12.5, false),
        new TextColumn('lenderName', 'Bên huy động ', 20, false),
        new TextColumn('investorTime', 'Kỳ hạn', 12.5, false),
        new TextColumn('investorTimeStart', 'Thời điểm đầu tư ', 12.5, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('amount', 'Số tiền đầu tư', 12.5, false, 1),
        new TextColumn('statusName', 'Trạng thái', 12.5, false),
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
