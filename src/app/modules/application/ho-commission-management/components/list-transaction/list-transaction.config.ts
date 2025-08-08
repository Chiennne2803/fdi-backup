import { CheckboxColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { ButtonConfig, DataTableButtonConfig, SearchBar, TaskBarConfig } from 'app/shared/models/datatable/task-bar.model';

export const TABLE_COMMISSIONS_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('admAccountIdBeneficiaryName', 'Người giới thiệu', 20, false),
        new TextColumn('admAccountIdPresenterName', 'Người được giới thiệu', 20, false),
        new TextColumn('genderName', 'Giới tính', 5, false),
        new TextColumn('dateOfBirth', 'Ngày sinh', 10, false, 'DD/MM/YYYY'),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 15, false),
        new TextColumn('transDate', 'Ngày ghi nhận', 15, false, 'DD/MM/YYYY'),
        new TextColumn('amount', 'Tiền hoa hồng (VNĐ)', 15, false, 3),
        new TextColumn('perTax', 'Thuế TNCN (%)', 15),
        new TextColumn('amountTax', 'Tiền thuế TNCN', 15, false, 3),
    ],
    title: 'Danh sách giao dịch', isViewDetail: false
};

export const TASK_BAR_CONFIG_COMMISSIONS: TaskBarConfig = {
    searchBar: new SearchBar('Nhập để tìm kiếm', true)
};

export const TABLE_BUTTON_ACTION_CONFIG_COMMISSIONS: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'SFF_COMMISSION_PAYMENT_EXPORT', fileName : 'Thanh_toan_hoa_hong'},
    ],
    otherBtn: [
        new ButtonConfig('SFF_COMMISSION_PAYMENT_INSERT', true, false, 'Thanh toán hoa hồng', 'attach_money', 'payment'),
        new ButtonConfig('SFF_COMMISSION_PAYMENT_DELETE', true, false, 'Huỷ giao dịch hoa hồng', 'heroicons_outline:x', 'deleted'),
    ]
};
