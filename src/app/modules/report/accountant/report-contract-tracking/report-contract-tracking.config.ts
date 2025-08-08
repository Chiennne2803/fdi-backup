import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 2),
        new TextColumn('fsTransInvestorId', 'Số hồ sơ đầu tư' , 10, false),
        new TextColumn('investorTimeStart', 'Ngày đầu tư' , 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('admAccountId', 'ID' , 10, false),
        new TextColumn('investorName', 'Tên khách hàng' , 10, false),
        new TextColumn('lenderName', 'Bên huy động' , 10, false),
        new TextColumn('taxCode', 'Mã số thuế' , 10, false),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ' , 5, false),
        new TextColumn('amount', 'Số tiền đầu tư' , 10, false, 1),
        new TextColumn('investorTime', 'Kỳ hạn' , 5, false),
        new TextColumn('rate', 'Lãi suất' , 5, false),
        new TextColumn('investorTimeExpried', 'Ngày hoàn trả dự kiến' , 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('interestAtimate', 'Lợi tức dự kiến' , 10, false, 1),
        new TextColumn('datePay', 'Ngày hoàn trả thực tế' , 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('payOriginal', 'Hoàn trả gốc thực tế' , 10, false, 1),
        new TextColumn('payInterest', 'Hoàn trả lãi thực tế' , 10, false, 1),
        new TextColumn('fee', 'Phí đầu tư' , 10, false, 1),
        new TextColumn('feeTax', 'Thuế TNCN' , 10, false, 1),
        new TextColumn('incomeReceived', 'Lợi tức thực nhận' , 10, false, 1),
        new TextColumn('statusName', 'Tình trạng hồ sơ đầu tư' , 10, false),
    ],
    title: '',isViewDetail: false,
};

export const TASK_BAR_STATISTICAL_REPORT_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
    },
    otherBtn: [
        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
    ]
};
