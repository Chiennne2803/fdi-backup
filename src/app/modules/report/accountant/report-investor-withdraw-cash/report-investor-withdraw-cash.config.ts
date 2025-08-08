import {ITableConfig} from '../../../../shared/models/datatable/table-config.model';
import {CheckboxColumn, TextColumn} from '../../../../shared/models/datatable/display-column.model';
import {ButtonConfig, TaskBarConfig} from '../../../../shared/models/datatable/task-bar.model';

export const TABLE_STATISTICAL_REPORT_INVESTOR_WITHDRAWAL_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('createdDate', 'Ngày rút tiền', 25, false, 'DD/MM/YYYY HH:mm:ss'),
        new TextColumn('admAccountIdRecipient', 'ID khách hàng', 25, false),
        new TextColumn('admAccountIdRecipientName', 'Tên khách hàng', 25, false),
        new TextColumn('amount', 'Số tiền', 25, false, 1),
    ],
    title: '',isViewDetail: false
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
