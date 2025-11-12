import {ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {ButtonConfig, DataTableButtonConfig, TaskBarConfig} from 'app/shared/models/datatable/task-bar.model';

export const TABLE_INVESTOR_INVESTING_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 3),
        new TextColumn('admAccountIdRecipient', 'ID khách hàng', 10, true),
        new TextColumn('transCode', 'Mã giao dịch', 20, true),
        new TextColumn('createdDate', 'Ngày yêu cầu', 10, undefined, 'DD/MM/YYYY'),
        new TextColumn('amount', 'Số tiền (VND)', 10, true, 1, false, true),
        new TextColumn('fee', 'Phí rút tiền (VND)', 10, true, 1, false, true),
        new TextColumn('admAccountIdRecipientName', 'Họ và tên khách hàng', 20, false),
        new TextColumn('identification', 'Số CCCD/Hộ chiếu ', 10, false),
        new TextColumn('accName', 'Tên tài khoản thụ hưởng', 20, false),
        new TextColumn('accNo', 'Số tài khoản', 10, false),
        new TextColumn('bankName', 'Tên ngân hàng', 20, false),
        new TextColumn('branchName', 'Chi nhánh', 10, false),
        new TextColumn('info', 'Nội dung', 20, false),
        new TextColumn('createdByName', 'Người lập yêu cầu', 20, false),
        new TextColumn('approvalByName', 'Người xử lý', 20, false),
        new TextColumn('approvalDate', 'Ngày xử lý', 10, undefined, 'DD/MM/YYYY'),
        new TextColumn('approvalComment', 'Ghi chú', 15, false),
        new TextColumn('statusName', 'Trạng thái', 12),
    ],
    title: 'Danh sách giao dịch rút tiền',isViewDetail: false,
    footerTable: [
        {
            label: 'Tổng tiền: ',
            value: 0,
            type: 'VND',
        },
        {
            label: 'Tổng phí: ',
            value: 0,
            type: 'VND',
        }
    ],
    displayScollX: true
};
export const TABLE_BUTTON_ACTION_INVESTING_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_WITHDRAW_CASH_TRANSACTION_EXPORT', fileName : 'Xu_ly_giao_dich_rut_tien_nha_dau_tu'},
    ]
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
    },
    otherBtn: [
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};
