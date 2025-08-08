import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 8),
        new TextColumn('admAccountId', 'ID', 10, false),
        new TextColumn('fullName', 'Bên huy động vốn', 20, false),
        new TextColumn('creditCode', 'Xếp hạng', 10, false),
        new TextColumn('maxLoan', 'Hạn mức', 10, false, 1),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 5, false),
        new TextColumn('amount', 'Số tiền huy động', 10, false, 1),
        new TextColumn('raisingCapitalName', 'Hình thức huy động', 10, false),
        new TextColumn('loanTimeCycle', 'Kỳ hạn', 5, false),
        new TextColumn('investorTimeStart', 'Ngày giải ngân', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('carddownAmount', 'Số tiền giải ngân', 10, false, 1),
        new TextColumn('debtAmount', 'Dư nợ', 10, false, 1),
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
