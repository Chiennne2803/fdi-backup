import {CheckboxColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import { ITableConfig } from '../../../shared/models/datatable/table-config.model';
import {ButtonConfig, DataTableButtonConfig, TaskBarConfig} from '../../../shared/models/datatable/task-bar.model';

export const TABLE_AUTOMATIC_INVESTMENT_CONFIG: ITableConfig = {
    columnDefinition: [
        new CheckboxColumn(),
        new TextColumn('investmentTime', 'Kỳ hạn(ngày)', 5),
        new TextColumn('investmentAmount', 'Số tiền đầu tư (VNĐ)', 15, false, 1),
        new TextColumn('preMatchingAmount', 'Số tiền chờ khớp lệnh (VNĐ)', 15, false, 1),
        new TextColumn('matchingAmount', 'Số tiền đã khớp lệnh (VNĐ)', 15, false, 1),
        new TextColumn('statusName', 'Trạng thái', 15),
        new TextColumn('createdDate', 'Ngày tạo', 15, false, 'DD/MM/YYYY - HH:mm:ss'),
        new TextColumn('expireDate', 'Ngày hết hiệu lực', 15, false, 'DD/MM/YYYY - HH:mm:ss'),
        new TextColumn('createdByName', 'Người tạo', 10),
    ],
    title: 'Quản lý lệnh đầu tư tự động',isViewDetail: false
};

export const TASK_BAR_CONFIG: TaskBarConfig = {
    searchBar: {
        placeholder: 'Nhập để tìm kiếm',
        isShowBtnFilter: true,
    }
};

export const TABLE_BUTTON_ACTION_CONFIG: DataTableButtonConfig = {
    commonBtn: [
        {type : 'export', role : 'INVESTOR_AUTO_EXPORT_AUTO_INVEST', fileName : 'Dau_tu_tu_dong'},
    ],
    otherBtn: [
        new ButtonConfig(
            'INVESTOR_AUTO_CANCEL_AUTO_INVEST',
            true,
            false,
            'Huỷ',
            'close',
            'deleted',
        ),
    ]
};
