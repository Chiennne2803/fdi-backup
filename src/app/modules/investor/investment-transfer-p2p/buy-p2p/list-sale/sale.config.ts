import {ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {ButtonActionColumn, IndexColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {TaskBarConfig} from 'app/shared/models/datatable/task-bar.model';

export const TABLE_INVESTOR_SALE_CONFIG: ITableConfig = {
    columnDefinition: [
        new IndexColumn('no', 'STT', 3),
        new TextColumn('transCode', 'Mã giao dịch', 20, true),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, false),
        new TextColumn('companyName', 'Bên huy động vốn', 15),
        new TextColumn('tranferAmount', 'Số tiền gốc(VNĐ)', 15, null, 1),
        new TextColumn('saleAmount', 'Giá trị chuyển nhượng (VNĐ)', 15, null, 1),
        new TextColumn('remainTranferAmount', 'Số tiền gốc còn lại (VNĐ)', 15, null, 1),
        new TextColumn('remainSalAmount', 'Giá trị chuyển nhượng còn lại (VNĐ)', 15, null, 1),
        new TextColumn('loanTimeCycle', 'Kỳ hạn(ngày)', 10, false),
        new TextColumn('investorTimeExpriedCount', 'Thời gian đầu tư còn lại', 10, false, 1),
        new TextColumn('investorTimeExpried', 'Ngày đáo hạn', 10, false, 'DD/MM/YYYY'),
        new TextColumn('statusName', 'Trạng thái', 10, false),
    ],
    title: 'Danh sách giao dịch chuyển nhượng', isViewDetail: false
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
        btnFilterRole: 'INVESTOR_P2P_SEARCH_PROPOSAL',
        searchBarRole: 'INVESTOR_P2P_SEARCH_PROPOSAL',
    }
};
