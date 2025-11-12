import { TextColumn } from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';

export const TABLE_COM_CHIDREN_CONFIG: ITableConfig = {
    columnDefinition: [
        new TextColumn('admAccountIdBeneficiaryName', 'Khách hàng', 10, false),
        new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, false),
        new TextColumn('amount', 'Tiền hoa hồng (VND)', 10, false, 3),
        new TextColumn('perTax', 'Thuế TNCN (%)', 10, false, 3),
        new TextColumn('amountTax', 'Tiền thuế TNCN (VND)', 10, false, 3),
    ],
    isViewDetail: false
};
