import {ITableConfig} from '../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, TextColumn} from '../../../shared/models/datatable/display-column.model';
import {DataTableButtonConfig, TaskBarConfig} from '../../../shared/models/datatable/task-bar.model';
import {LoanStatus} from '../../../enum';
import {InputSearch} from '../../../shared/components/group-search/search-config.models';

export const STATUS_TEXT_MAP = {
    [LoanStatus.RECEIVE]: 'Đang xem xét',
    [LoanStatus.WAIT_FOR_PROCESS]: 'Chờ xử lý',
    [LoanStatus.REWORK]: 'Làm lại',
    [LoanStatus.WAIT_FOR_REVIEW]: 'Trình hội đồng tín dụng',
    [LoanStatus.APPROVE]: 'Đã phê duyệt',
    [LoanStatus.REJECT]: 'Từ chối',
    [LoanStatus.DISBURSEMENT]: 'Giải ngân',
    [LoanStatus.WAIT_FOR_PAYMENT]: 'Chờ tất toán',
    [LoanStatus.CLOSE]: 'Đóng',
    [LoanStatus.CANCEL]: 'Huỷ',
};

export const TABLE_PROFILE_RECEPTION_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, true),
        new TextColumn('admAccountName', 'Bên huy động vốn', 15,),
        new TextColumn('loanTimeCycle', 'Kỳ hạn(ngày)', 10),
        new TextColumn('amount', 'Số tiền huy động', 15, false, 1),
        new TextColumn('rate', 'Lãi suất(%/năm)', 10, false),
        new TextColumn('reasons', 'Mục đích', 10, false),
        new TextColumn('collateralTypeName', 'Hình thức bảo đảm', 10, false),
        new TextColumn('createdByName', 'Người lập', 10, false),
        new TextColumn('createdDate', 'Ngày lập', 15, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('processStatusName', 'Trạng thái xử lý', 15, false),

    ],
    title: 'Hồ sơ đang tiếp nhận', isViewDetail: false
};

export const TABLE_PROFILE_MANAGEMENT_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, true),
        new TextColumn('admAccountName', 'Bên huy động vốn', 15,),
        new TextColumn('loanTimeCycle', 'Kỳ hạn(ngày)', 10),
        new TextColumn('amount', 'Số tiền huy động', 15, false, 1),
        new TextColumn('rate', 'Lãi suất(%/năm)', 10, false),
        new TextColumn('reasons', 'Mục đích', 10, false),
        new TextColumn('collateralTypeName', 'Hình thức bảo đảm', 10, false),
        new TextColumn('createdByName', 'Người lập', 10, false),
        new TextColumn('createdDate', 'Ngày lập', 15, false, 'DD/MM/YYYY HH:mm:ss'),
    ],
    title: 'Hồ sơ đang xem xét', isViewDetail: false
};

export const TABLE_PROFILE_MANAGEMENT_REVIEW: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, true),
        new TextColumn('admAccountName', 'Bên huy động vốn', 15,),
        new TextColumn('loanTimeCycle', 'Kỳ hạn(ngày)', 10),
        new TextColumn('amount', 'Số tiền huy động', 15, false, 1),
        new TextColumn('rate', 'Lãi suất(%/năm)', 10, false),
        new TextColumn('reasons', 'Mục đích', 10, false),
        new TextColumn('collateralTypeName', 'Hình thức bảo đảm', 10, false),
        new TextColumn('createdByName', 'Người lập', 10, false),
        new TextColumn('createdDate', 'Ngày lập', 15, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('processStatusName', 'Trạng thái xử lý', 15, false),

    ],
    title: 'Hồ sơ đang xem xét', isViewDetail: false
};


export const TABLE_PROFILE_MANAGEMENT_RE_REVIEW: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, true),
        new TextColumn('admAccountName', 'Bên huy động vốn', 15,),
        new TextColumn('loanTimeCycle', 'Kỳ hạn(ngày)', 10),
        new TextColumn('amount', 'Số tiền huy động', 15, false, 1),
        new TextColumn('rate', 'Lãi suất(%/năm)', 10, false),
        new TextColumn('reasons', 'Mục đích', 10, false),
        new TextColumn('collateralTypeName', 'Hình thức bảo đảm', 10, false),
        new TextColumn('createdByName', 'Người lập', 10, false),
        new TextColumn('createdDate', 'Ngày lập', 15, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('processStatusName', 'Trạng thái xử lý', 15, false),

    ],
    title: 'Hồ sơ yêu cầu xem xét lại', isViewDetail: false
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
    }
};

export const TABLE_BUTTON_ACTION_CONFIG: DataTableButtonConfig = {
    commonBtn: [{type : 'export', role : '', fileName : 'Danh_sach_ho_so'}],
    otherBtn: []
};

