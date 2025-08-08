import {ITableConfig} from '../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, TextColumn, TextToolTipColumn} from '../../../shared/models/datatable/display-column.model';
import {ButtonConfig, DataTableButtonConfig, TaskBarConfig} from '../../../shared/models/datatable/task-bar.model';
import {
    DateTimeSearch,
    DropListSearch, FromToSearch,
    InputSearch
} from '../../../shared/components/group-search/search-config.models';
import {TransInvestorStatus, TransInvestorType} from '../../../enum';

export const TABLE_INVESTOR_INVESTING_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('fsTransInvestorId', 'Mã hồ sơ đầu tư', 10, true),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 7, false),
        new TextColumn('investorCode', 'Mã giao dịch đầu tư', 7, false),
        new TextColumn('admAccountName', 'Bên huy động', 7, false),
        new TextColumn('typeName', 'Hình thức đầu tư', 10),
        new TextColumn('amount', 'Số tiền đầu tư', 10, false, 1),
        new TextColumn('investorTime', 'Kỳ hạn(ngày)', 12, false),
        new TextColumn('rate', 'Lãi suất(%/năm)', 7, false),
        new TextColumn('interestAtimate', 'Lãi dự kiến', 7, false, 1),
        new TextColumn('interest', 'Lãi thực tế', 7, false, 1),
        new TextColumn('investorTimeExpried', 'Ngày đáo hạn', 7, false, 'DD/MM/YYYY'),
        new TextToolTipColumn('area', 'Lĩnh vực đầu tư', 20),
        new TextColumn('statusName', 'Trạng thái', 7),
        new TextColumn('createdDate', 'Ngày tạo', 7, false, 'DD/MM/YYYY HH:mm:ss'),
    ],
    title: 'Hồ sơ đang đầu tư',isViewDetail: false
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
        btnFilterRole: 'INVESTOR_LOAN_PROFILE_SEARCH',
        searchBarRole: 'INVESTOR_LOAN_PROFILE_SEARCH',
    },
    otherBtn: [
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};

export const advanceSearch = {
    config: [
        new InputSearch('fsLoanProfilesId', 'Mã hồ sơ đầu tư', null, false),
        new InputSearch('interestAtimate', 'Lãi dự kiến', null, false, "number"),
        new DropListSearch('type', 'Hình thức đầu tư', [
            {label: 'Tất cả', value: ''},
            {label: 'Tự động', value: TransInvestorType.AUTO},
            {label: 'Tự chọn', value: TransInvestorType.MANUAL},
            {label: 'Chuyển nhượng', value: TransInvestorType.TRANSF},
        ], '',false),
        new InputSearch('interest', 'Lãi thực tế', null, false, "number"),
        new FromToSearch('amount', 'Số tiền đầu tư', null, "number"),
        new InputSearch('area', 'Lĩnh vực đầu tư', null, false),
        new DropListSearch('investorTime', 'Kỳ hạn(ngày)', [], null, false),
        new DropListSearch('status', 'Trạng thái', [
            {label: 'Tất cả', value: ''},
            {label: 'Chờ phê duyệt', value: TransInvestorStatus.WAIT},
            {label: 'Đã phê duyệt', value: TransInvestorStatus.APPROVAL},
            {label: 'Đang đầu tư', value: TransInvestorStatus.DO_INVEST},
            {label: 'Đã đầu tư', value: TransInvestorStatus.COMPLETE_INVEST},
            {label: 'Từ chối', value: TransInvestorStatus.REJECT},
        ], '',false),
        new InputSearch('rate', 'Lãi suất (%/năm)', null, false),
        new DateTimeSearch('createdDate', 'Ngày tạo', null, false),
    ]
};

export const TABLE_BUTTON_ACTION_CONFIG: DataTableButtonConfig = {
    commonBtn: [{type : 'export', role : 'INVESTOR_LOAN_PROFILE_EXPORT', fileName : 'Cac_ho_so_da_dau_tu'}],
};
