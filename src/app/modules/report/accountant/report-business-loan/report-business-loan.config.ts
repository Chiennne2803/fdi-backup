import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('fullName', 'Bên huy động vốn', 25, false),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 25, false),
        new TextColumn('amount', 'Tổng tiền huy động', 25, false, 1),
        new TextColumn('payOriginal', 'Tổng hoàn trả gốc', 25, false, 1),
        new TextColumn('debtAmount', 'Dư nợ', 25, false, 1),
    ],
    title: '',isViewDetail: false,
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
