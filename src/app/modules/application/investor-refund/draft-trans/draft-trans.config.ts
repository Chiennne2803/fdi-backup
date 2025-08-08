import { CheckboxColumn, IndexColumn, StatusColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import {
    ButtonConfig,
    DataTableButtonConfig,
    SearchBar,
    TaskBarConfig
} from 'app/shared/models/datatable/task-bar.model';

export const TABLE_INVESTOR_TRANSPAY_REQ_DRAFT_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 8),
        new TextColumn('transCode', 'Mã giao dịch', 25, true),
        new TextColumn('fsLoanProfilesId', 'Hồ sơ huy động vốn', 12),
        new TextColumn('lenderName', 'Bên huy động vốn', 15),
        new TextColumn('amountInterest', 'Số tiền thanh toán', 15, false, 1),
        new TextColumn('fsCardDownCode', 'Đợt giải ngân', 25),
        new TextColumn('createdByName', 'Người lập', 15),
        new TextColumn('statusName', 'Trạng thái', 10),
    ], isViewDetail: false,
    title: 'Soạn thảo'
};

export const TASK_BAR_TRANSPAY_REQ_DRAFT_CONFIG: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true),
    otherBtn: [
        new ButtonConfig('', true, false, 'Lập yêu cầu', 'feather:plus-circle', 'add'),
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const TABLE_BUTTON_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : '', fileName : 'Xu_ly_giao_dich_hoan_tra_dau_tu'},
    ],
};
