import { ACCOUNT_BANK_TYPE_TEXT_MAP } from 'app/enum/account-bank.enum';
import { StatusColumn, TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';


export const TABLE_ACCOUNT_CONFIG: ITableConfig = {
    columnDefinition: [
        new TextColumn('accNo', 'Số tài khoản', 20, true),
        new TextColumn('bankName', 'Tên ngân hàng', 20),
        new TextColumn('bankBranch', 'Chi nhánh', 15),
        new TextColumn('accName', 'Tên chủ tài khoản', 15),
        new StatusColumn('accType', 'Phân loại toàn khoản', 10, ACCOUNT_BANK_TYPE_TEXT_MAP),
    ],
    title: 'Thông tin tài khoản',
    isViewDetail: false
};
