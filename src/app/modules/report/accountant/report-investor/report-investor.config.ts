import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('admAccountId', 'ID nhà đầu tư', 5, false),
        new TextColumn('accountName', 'Tên tài khoản', 10, false),
        new TextColumn('fullName', 'Tên nhà đầu tư', 15, false, null,true, null, null, true, null,
            'max-w-15 text-ellipsis overflow-hidden '),
        new TextColumn('accountBank', 'Số tài khoản', 10, false),
        new TextColumn('bankName', 'Ngân hàng', 10, false),
        new TextColumn('bankBranch', 'Chi nhánh', 10, false),
        new TextColumn('topupAmount', 'Đã nạp tiền', 5, false, 1),
        new TextColumn('investAmount', 'Đang đầu tư', 5, false, 1),
        new TextColumn('withdrawAmount', 'Đã rút tiền', 5, false, 1),
        new TextColumn('preWithdrawAmount', 'Lệnh rút tiền chờ xử lý', 5, false, 1),
        new TextColumn('weu', 'Số dư khả dụng', 5, false, 1),
        new TextColumn('manageStaffName', 'Nhân viên phụ trách', 10, false),
    ],
    title: '', isViewDetail: false,
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
