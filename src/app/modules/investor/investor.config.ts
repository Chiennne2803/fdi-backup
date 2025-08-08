/* eslint-disable @typescript-eslint/naming-convention */
import {CheckboxColumn, IndexColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {ButtonConfig, DataTableButtonConfig, TaskBarConfig} from '../../shared/models/datatable/task-bar.model';

export const TABLE_WITHDRAW_CONFIG: ITableConfig = {
    columnDefinition: [
        new IndexColumn('no', 'STT', 2),
        new TextColumn('transCode', 'Mã giao dịch', 5, true),
        new TextColumn('createdDate', 'Ngày rút tiền', 5, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('amount', 'Số tiền rút', 10, false, 1),
        new TextColumn('accName', 'Tên tài khoản thụ hưởng', 15),
        new TextColumn('accNo', 'Số tài khoản', 7),
        new TextColumn('bankName', 'Tên ngân hàng', 15),
        new TextColumn('branchName', 'Chi nhánh', 15),
        new TextColumn('info', 'Nội dung', 10),
        new TextColumn('createdByName', 'Người lập yêu cầu', 7),
        new TextColumn('approvalByName', 'Người xử lý', 7),
        new TextColumn('approvalDate', 'Ngày xử lý', 5, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('approvalComment', 'Nội dung xử lý', 10),
        new TextColumn('statusName', 'Trạng thái', 5),
    ],
    title: 'Danh sách rút tiền', isViewDetail: false
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
        btnFilterRole: 'INVESTOR_CASHOUT_SEARCH_WITHDRAWAL',
        searchBarRole: 'INVESTOR_CASHOUT_SEARCH_WITHDRAWAL'
    },
    otherBtn: [
        new ButtonConfig('INVESTOR_CASHOUT_CREATE_WITHDRAWAL_ORDER', true, false, 'Rút tiền', 'feather:dollar-sign', 'add'),
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog'),
    ]
};

export const TABLE_BUTTON_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'INVESTOR_CASHOUT_EXPORT'},
    ],
};
