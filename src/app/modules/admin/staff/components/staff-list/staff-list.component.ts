import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {AdmAccountDetailDTO} from 'app/models/admin';
import {BaseResponse} from 'app/models/base';
import {ManagementStaffService} from 'app/service';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {Observable} from 'rxjs';
import {TABLE_BUTTON_ACTION_CONFIG, TABLE_STAFF_CONFIG, TASK_BAR_CONFIG} from './staff.config';
import {MatDialog} from "@angular/material/dialog";
import {fuseAnimations} from '@fuse/animations';
import {ButtonConfig, CommonButtonConfig} from "../../../../../shared/models/datatable/task-bar.model";


@Component({
    selector: 'staff-list',
    templateUrl: './staff-list.component.html',
    styleUrls: ['./staff-list.component.scss'],
    animations: fuseAnimations,
})
export class StaffListComponent implements OnChanges {
    @Input() departmentId: number = 0;
    @Output() viewDetail: EventEmitter<ButtonTableEvent> = new EventEmitter<ButtonTableEvent>();
    @Output() handleSearch: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() handlePageSwitch: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
    @Output() handleAdvancedSearch: EventEmitter<ButtonTableEvent> = new EventEmitter<ButtonTableEvent>();

    public _tableStaffConfig = TABLE_STAFF_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG;
    public _tableBtnConfig = TABLE_BUTTON_ACTION_CONFIG;
    public _dataSource$: Observable<BaseResponse>;
    private requestStaff = new AdmAccountDetailDTO();

    constructor(
        private _matDialog: MatDialog,
        private _staffService: ManagementStaffService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && !changes.departmentId.currentValue) {
            this._dataSource$ = this._staffService.staffs$;
        }
        if (changes && !!changes.departmentId.currentValue) {
            this.requestStaff = {
                admDepartmentsId: this.departmentId
            };
            this._staffService.doSearch(this.requestStaff).subscribe(() => {
                this._dataSource$ = this._staffService.staffs$;
            });
        }
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this.viewDetail.emit(new ButtonTableEvent('add'));
                break;
            case 'edit':
                this.viewDetail.emit(new ButtonTableEvent(event.action, (event.rowItem as AdmAccountDetailDTO)));
                break;
            case 'lock':
            case 'unlock':
                this.viewDetail.emit(new ButtonTableEvent(event.action, (event.rowItem as AdmAccountDetailDTO)));
                break;
            case 'advanced-search':
                this.handleAdvancedSearch.emit(event);
                break;
            default:
                break;
        }
    }

    handleRowClick(event: AdmAccountDetailDTO): void {
        this.viewDetail.emit(new ButtonTableEvent('view', (event as AdmAccountDetailDTO)));
    }

    checkboxItemChange(rows): void {
        const hasActive = rows.filter(item => (item.accountStatus === 1)).length > 0;
        const hasDeactive = rows.filter(item => item.accountStatus !== 1).length > 0;
        const hasClose = rows.filter(item => item.accountStatus === 3).length > 0;
        let lstCommonBtn: CommonButtonConfig[] = [];

        if(hasActive && hasDeactive || hasClose) {
            //ko co
        } else if(hasDeactive) {
            lstCommonBtn.push( {type: 'unlock', role: 'SFF_EMPLOYEE_UPDATE'});
        } else if(hasActive) {
            lstCommonBtn.push({type: 'lock', role: 'SFF_EMPLOYEE_UPDATE'});
        }

        this._tableBtnConfig = {
            commonBtn: [
                ...lstCommonBtn,
                {type: 'export', role: 'SFF_EMPLOYEE_EXPORT', fileName : 'Quan_ly_nhan_vien'},
                {type : 'edit', role : 'SFF_EMPLOYEE_UPDATE'},
            ],
            otherBtn: [
            ]
        };
    }
}
