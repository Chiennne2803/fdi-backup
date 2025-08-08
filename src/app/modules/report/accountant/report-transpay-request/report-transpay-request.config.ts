import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_BUSINESS_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('tax', 'Mã số thuế doanh nghiệp/ cá nhân', 10, false),
        new TextColumn('lenderName', 'Bên huy động', 10, false),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, false),
        new TextColumn('amount', 'Số tiền', 10, false, 1),
        new TextColumn('period', 'Kỳ hạn', 10, false),
        new TextColumn('interest', 'Lãi suất', 10, false),
        new TextColumn('amountExpirDate', 'Số ngày quá hạn', 10, false),
        new TextColumn('investorTimeExpried', 'Ngày hoàn trả dự kiến', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('interestAtimate', 'Lợi tức dự kiến', 10, false, 1),
        new TextColumn('investorTimeStart', 'Ngày giải ngân', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('investorId', 'Mã giải ngân', 10, false),
        new TextColumn('carddownAmount', 'Số tiền giải ngân', 10, false, 1),
        new TextColumn('transpayId', 'Mã hoàn trả', 10, false),
        new TextColumn('expirDate', 'Ngày hoàn trả thực tế', 10, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('payOriginal', 'Hoàn trả gốc', 10, false, 1),
        new TextColumn('payInterest', 'Hoàn trả lãi', 10, false, 1),
        new TextColumn('feeTax', 'Thuế TNCN', 10, false, 1),
        new TextColumn('interestAfterTax', 'Hoàn trả lãi đã trừ thuế TNCN', 10, false, 1),
        new TextColumn('disbursementStatusName', 'Tình trạng đợt giải ngân', 10, false),
    ],
    title: 'Báo cáo giải ngân và hoàn trả',isViewDetail: false,
    displayScollX: true
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
