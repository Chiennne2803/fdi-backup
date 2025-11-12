import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, IndexColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new IndexColumn('no', 'STT', 4),
        new TextColumn('admAccountId', 'ID khách hàng', 10, false),
        new TextColumn('fullName', 'Nhà đầu tư', 20, false),
        new TextColumn('email', 'Email', 10, false),
        new TextColumn('mobile', 'Số điện thoại', 10, false),
        // new TextColumn('transType', '', 10, false),
        new TextColumn('transCode', 'Mã giao dịch', 10, false),
        new TextColumn('amount', 'Số tiền nhận', 12.5, false, 1),
        new TextColumn('newAmount', 'Số dư khả dụng ', 10,  false, 1),
        new TextColumn('statusName', 'Trạng thái', 10, false),
        new TextColumn('transDate', 'Ngày giao dịch', 20, false, 'DD/MM/YYYY HH:mm:ss'),
        
    ],
    title: '', isViewDetail: false,
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
