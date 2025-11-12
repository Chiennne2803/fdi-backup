import { CheckboxColumn, IndexColumn, TextColumn } from '../../../../shared/models/datatable/display-column.model';
import { ITableConfig } from '../../../../shared/models/datatable/table-config.model';
import { ButtonConfig, DataTableButtonConfig, TaskBarConfig } from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_WAITING_TRANSACTION_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('transCode', 'Mã yêu cầu', 25, true),
        new TextColumn('amount', 'Số tiền giải ngân', 15, false, 1),
        new TextColumn('fsLoanProfilesId', 'Hồ sơ huy động vốn', 10, false),
        new TextColumn('createdByRole', 'Vai trò', 15, false),
        new TextColumn('createdByName', 'Người lập', 15, false),
        new TextColumn('createdDate', 'Ngày Lập', 15, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('approvalByName', 'Người xử lý', 15, false),
        new TextColumn('approvalDate', 'Ngày xử lý', 15, false,'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('statusName', 'Trạng thái', 15, false),
    ],
    title: 'Giao dịch giải ngân chờ xử lý',isViewDetail: false,
    footerTable: [{
        label: 'Tổng tiền:',
        value: 0,
        type: 'VND'
    }]
};


export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
    }
};

export const TABLE_BUTTON_WAITING_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_DISBURSEMENT_TRANSACTION_EXPORT', fileName : 'Danh_sach_yeu_cau_giai_ngan'},
        {type : 'approve', role : 'SFF_DISBURSEMENT_TRANSACTION_APPROVE'},
    ],
};
