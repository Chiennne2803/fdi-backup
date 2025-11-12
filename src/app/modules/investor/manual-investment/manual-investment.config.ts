import {CheckboxColumn, TextColumn} from '../../../shared/models/datatable/display-column.model';
import {ITableConfig} from '../../../shared/models/datatable/table-config.model';
import {TaskBarConfig} from '../../../shared/models/datatable/task-bar.model';

export const TABLE_MANUAL_INVESTMENT_CONFIG: ITableConfig = {
    columnDefinition: [
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, true),
        new TextColumn('createdByName', 'Bên huy động vốn', 15),
        new TextColumn('certificationNumber', 'Số GPKD', 10),
        new TextColumn('amount', 'Tổng số tiền(VND)', 15, false, 1),
        new TextColumn('loanTimeCycle', 'Kỳ hạn(ngày)', 10, false),
        new TextColumn('reasons', 'Mục đích', 10, false),
        new TextColumn('remainingAmount', 'Số tiền có thể đầu tư(VND)', 10, false, 1),
        new TextColumn('remainAmount', 'Tỉ lệ đã được đầu tư(%)', 10, false),
    ],
    title: 'Danh sách hồ sơ',isViewDetail: false
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm bên huy động vốn',
        isShowBtnFilter: true,
    }
};
