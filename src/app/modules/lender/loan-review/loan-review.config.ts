import {CheckboxColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {DataTableButtonConfig, TaskBarConfig} from '../../../shared/models/datatable/task-bar.model';

export const TABLE_LOAN_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, true),
        new TextColumn('loanTimeCycle', 'Kỳ hạn(ngày)', 10),
        new TextColumn('amount', 'Số tiền huy động(VND)', 15, false, 1),
        new TextColumn('rate', 'Lãi suất(%)', 10, false),
        new TextColumn('reasons', 'Mục đích', 10, false),
        new TextColumn('createdDate', 'Ngày lập', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('statusName', 'Trạng thái', 10),
    ],
    title: 'Hồ sơ đang xem xét',isViewDetail: false
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
        btnFilterRole : 'LENDER_LOAN_PROFILE_REVIEW_ADVANCED_SEARCH'
    }
};

export const TABLE_BUTTON_ACTION: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'LENDER_LOAN_PROFILE_REVIEW_EXPORT_PENDING_PROFILES'},
    ],
};
