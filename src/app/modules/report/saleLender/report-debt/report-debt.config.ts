import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, false),
        new TextColumn('raisingCapitalName', 'Hình thức huy động', 10, false),
        new TextColumn('amount', 'Số tiền huy động', 10, false, 1),
        new TextColumn('loanTimeCycle', 'Kỳ hạn', 10, false),
        new TextColumn('rate', 'Lãi suất', 10, false),
        new TextColumn('payOriginal', 'Gốc', 10, false, 1),
        new TextColumn('payInterest', 'Lãi', 10, false, 1),
        new TextColumn('overdueAmount', 'Phạt chậm trả', 10, false, 1),
        new TextColumn('originalDeduction', 'Giảm trừ gốc', 10, false, 1),
        new TextColumn('interestDeduction', 'Giảm trừ lãi', 10, false, 1),
        new TextColumn('total', 'Cộng', 10, false, 1),
        new TextColumn('debtAmount', 'Dư nợ gốc', 10, false, 1),
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
