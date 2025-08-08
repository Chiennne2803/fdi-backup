import {CheckboxColumn, IndexColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {ButtonConfig, DataTableButtonConfig, TaskBarConfig} from '../../shared/models/datatable/task-bar.model';
import {LoanStatus} from "../../enum/loan-status.enum";
import {
    FSCardDownStatus,
    FSTranspayPeriodStatus,
    FSTransPayReqStatus,
    TransInvestorStatus
} from "../../enum/trans-investor-status.enum";

export const STATUS_TEXT_MAP = {
    [LoanStatus.RECEIVE]: 'Tiếp nhận',
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

export const TRANS_INVESTOR_STATUS_TEXT_MAP = {
    [TransInvestorStatus.WAIT]: 'Chờ xử lý',
    [TransInvestorStatus.REJECT]: 'Từ chối',
    [TransInvestorStatus.APPROVAL]: 'Đã phê duyệt',
    [TransInvestorStatus.COMPLETE_INVEST]: 'Đã giải ngân',
    [TransInvestorStatus.DO_INVEST]: 'Đã giải ngân',
};

export const TRANS_PAY_STATUS_TEXT_MAP = {
    [FSTranspayPeriodStatus.WAIT_PAY]: 'Chờ thanh toán',
    [FSTranspayPeriodStatus.PAID]: 'Đã thanh toán',
};

export const FS_CARD_DOWN_STATUS_TEXT_MAP = {
    [FSCardDownStatus.DRAFT]: 'Soạn thảo',
    [FSCardDownStatus.WAITING_PROGRESSING]: 'Chờ xử lý',
    [FSCardDownStatus.APPROVE]: 'Phê duyệt',
    [FSCardDownStatus.REJECT]: 'Từ chối',
};

export const FS_TRANS_PAY_REQ_STATUS_TEXT_MAP = {
    [FSTransPayReqStatus.WAITING_PAY]: 'Chờ thanh toán',
    [FSTransPayReqStatus.WAITING_PROGRESSING]: 'Chờ xử lý',
    [FSTransPayReqStatus.WAITING_APPROVE]: 'Chờ phê duyệt',
    [FSTransPayReqStatus.APPROVE]: 'Phê duyệt',
    [FSTransPayReqStatus.REJECT]: 'Từ chối',
    [FSTransPayReqStatus.TIME_OUT]: 'Hết hạn',
};

export const TABLE_TOPUP_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        // new TextColumn('fsTopupId', 'Số thứ tự', 10, false),
        new IndexColumn('no', 'STT', 2),
        new TextColumn('fsTopupCode', 'Mã giao dịch', 15, false),
        new TextColumn('accName', 'Người thụ hưởng', 20, false),
        new TextColumn('bankName', 'Ngân hàng', 20, false),
        new TextColumn('branchName', 'Chi nhánh', 20, false),
        new TextColumn('accNo', 'Số tài khoản', 15, false),
        new TextColumn('statusName', 'Trạng thái', 10, false),
        new TextColumn('createdByName', 'Người tạo', 10, false,),
        new TextColumn('createdDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY HH:mm:ss'),
    ],
    title: 'Nạp tiền đầu tư',isViewDetail: false
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        searchBarRole: 'INVESTOR_TOPUP_SEARCH_DEPOSIT',
        isShowBtnFilter: false,
    },
    otherBtn: [
        new ButtonConfig('INVESTOR_TOPUP_CREATE_DEPOSIT_ORDER', true, false, 'Nạp tiền', 'feather:dollar-sign', 'add')
    ]
};

export const TABLE_BUTTON_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'INVESTOR_CASHOUT_EXPORT'},
    ],
};
