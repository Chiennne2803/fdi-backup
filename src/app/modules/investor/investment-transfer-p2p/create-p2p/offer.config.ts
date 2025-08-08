import {ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {ButtonConfig, DataTableButtonConfig, TaskBarConfig} from 'app/shared/models/datatable/task-bar.model';

export const TABLE_INVESTOR_OFFERING_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 3),
        new TextColumn('transCode', 'Mã giao dịch ', 10, true),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 5, false),
        new TextColumn('companyName', 'Bên huy động vốn', 10),
        new TextColumn('tranferAmount', 'Số tiền chuyển nhượng (VNĐ)', 10, false, 1),
        new TextColumn('saleAmount', 'Số tiền chào bán (VNĐ)', 10, false, 1),
        new TextColumn('remainTranferAmount', 'Số tiền chuyển nhượng còn lại (VNĐ)', 10, false, 1),
        new TextColumn('remainSalAmount', 'Số tiền chào bán còn lại (VNĐ)', 10, false, 1),
        new TextColumn('feeP2P', 'Phí chuyển nhượng (VNĐ)', 10, false, 1),
        new TextColumn('loanTimeCycle', 'Kỳ hạn(ngày)', 10, false, 1),
        new TextColumn('investorTimeExpried', 'Ngày đáo hạn', 10, false, 'DD/MM/YYYY'),
        new TextColumn('createdDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 10),
        // new TextColumn('processResultName', 'Kết quả', 10),
    ],
    title: 'Danh sách hồ sơ chuyển nhượng của tôi',isViewDetail: false
};

export const TABLE_INVESTOR_FINISHED_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 3),
        new TextColumn('transCode', 'Mã giao dịch chuyển nhượng', 10, true),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 5, false),
        new TextColumn('companyName', 'Bên huy động vốn', 10),
        new TextColumn('tranferAmount', 'Số tiền chuyển nhượng (VNĐ)', 10, false, 1),
        new TextColumn('saleAmount', 'Số tiền chào bán (VNĐ)', 10, false, 1),
        new TextColumn('remainTranferAmount', 'Số tiền chuyển nhượng còn lại (VNĐ)', 10, false, 1),
        new TextColumn('remainSalAmount', 'Số tiền chào bán còn lại (VNĐ)', 10, false, 1),
        new TextColumn('feeP2P', 'Phí chuyển nhượng (VNĐ)', 10, false, 1),
        new TextColumn('loanTimeCycle', 'Kỳ hạn(ngày)', 10, false, 1),
        new TextColumn('investorTimeExpried', 'Ngày đáo hạn', 10, false, 'DD/MM/YYYY'),
        new TextColumn('createdDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 10),
        // new TextColumn('processResultName', 'Kết quả', 10),
    ],
    title: 'Danh sách chuyển nhượng',isViewDetail: false
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
        btnFilterRole: 'INVESTOR_P2P_SEARCH_FOR_SALE',
        searchBarRole: 'INVESTOR_P2P_SEARCH_FOR_SALE'
    },
    otherBtn: [
        new ButtonConfig('INVESTOR_P2P_CREATE_TRANSFER_REQUEST', true, false, 'Chuyển nhượng', 'feather:plus-circle', 'add'),
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG: DataTableButtonConfig = {
    commonBtn: [],
    otherBtn: [
        new ButtonConfig(
            'INVESTOR_P2P_CANCEL_TRANSFER',
            true,
            false,
            'Huỷ',
            'delete',
            'deleted',
        ),
    ]
};
