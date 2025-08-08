import {ITableConfig} from '../../../shared/models/datatable/table-config.model';
import {
    CheckboxColumn,
    IndexColumn,
    StatusColumn,
    TextColumn
} from '../../../shared/models/datatable/display-column.model';
import {DataTableButtonConfig, TaskBarConfig} from '../../../shared/models/datatable/task-bar.model';


export const TABLE_DEBT_MANAGEMENT_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        // new IndexColumn('no', 'STT', 8),
        new TextColumn('fsLoanProfilesId', 'Hồ sơ huy động vốn', 10, true),
        new TextColumn('fullName', 'Bên huy động vốn', 15,),
        new TextColumn('loanTimeCycle', 'Kỳ hạn(ngày)', 15, false, 1),
        new TextColumn('totalAmount', 'Số tiền huy động ', 15, false, 1),
        new TextColumn('totalAmountInteres', 'Lãi dự kiến', 15, false, 1),
        // new TextColumn('expireRate', 'Số tiền phạt', 15, false, 1),
        new TextColumn('payAmount', 'Gốc đã trả', 15, false, 1),
        new TextColumn('totalAmountDeb', 'Nợ gốc còn lại', 15, false, 1),
        new StatusColumn('isOverdueDeb', 'Hồ sơ có nợ cuối kỳ', 10, {'1': 'x', '2': ''}),
        new TextColumn('statusName', 'Trạng thái', 10),
    ],
    title: 'Quản lý công nợ',
    isViewDetail: false,
    noScroll: false
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
    }
};

export const TABLE_BUTTON_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : '', fileName : 'Quan_ly_cong_no'},
    ],
};
