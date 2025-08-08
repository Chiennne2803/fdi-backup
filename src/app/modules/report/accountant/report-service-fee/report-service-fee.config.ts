import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('loanTimeStart', 'Thời gian bắt đầu huy động', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, false),
        new TextColumn('fullName', 'Bên huy động vốn', 20, false),
        new TextColumn('loanTimeCycle', 'Kỳ hạn', 10, false, 1),
        new TextColumn('amount', 'Số tiền huy động', 10, false, 1),
        new TextColumn('serviceFee', 'Phí dịch vụ', 10, false, 1),
        new TextColumn('vat', 'VAT 10%', 10, false, 1),
        new TextColumn('manageStaffName', 'Nhân viên phụ trách', 10, false),
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
