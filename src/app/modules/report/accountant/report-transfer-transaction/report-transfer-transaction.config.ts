import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {
    CheckboxColumn,
    ExpandColumn,
    IndexColumn,
    TextColumn
} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_TRANSFER_TRANSACTION_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new ExpandColumn('expand', 'Hành động', 5),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 8, false),
        new TextColumn('companyName', 'Bên huy động vốn', 15, false, null,true, null, null, true, null,
            'max-w-15 text-ellipsis overflow-hidden '),
        new TextColumn('investorCode', 'Mã giao dịch đầu tư', 15, false),
        new TextColumn('fullName', 'Bên chuyển nhượng', 15, false),
        new TextColumn('transCode', 'Mã chuyển nhượng', 15, false),
        new TextColumn('createdDate', 'Ngày chuyển nhượng', 18, false, 'DD/MM/YYYY - HH:mm:ss'),
        new TextColumn('tranferAmount', 'Số tiền chuyển nhượng (VNĐ)', 10, false, 1),
        new TextColumn('saleAmount', 'Số tiền chào bán (VNĐ)', 10, false, 1),
        new TextColumn('remainTranferAmount', 'Số tiền chuyển nhượng còn lại (VNĐ)', 10, false, 1),
        new TextColumn('remainSalAmount', 'Số tiền chào bán còn lại (VNĐ)', 10, false, 1),
        new TextColumn('feeP2P', 'Phí chuyển nhượng (VNĐ)', 10, false, 1),
        new TextColumn('statusName', 'Trạng thái', 15, false),
        new TextColumn('processResultName', 'Kết quả chuyển nhượng', 15, false),

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
