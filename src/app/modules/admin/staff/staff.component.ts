import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSelectionListChange} from '@angular/material/list';
import {FuseConfirmationService} from '@fuse/services/confirmation';
import {AdmAccountDetailDTO} from 'app/models/admin';
import {AdmDepartmentsDTO} from 'app/models/admin/AdmDepartmentsDTO.model';
import {DepartmentsService, ManagementStaffService} from 'app/service';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {StaffDetailComponent} from './components/staff-detail/staff-detail.component';
import {FuseAlertService} from '../../../../@fuse/components/alert';
import {PageEvent} from "@angular/material/paginator";
import {GroupSearchComponent} from "../../../shared/components/group-search/group-search.component";
import {DropListSearch, IDropList, InputSearch} from "../../../shared/components/group-search/search-config.models";
import { UserStatus} from "../../../enum";
import {fuseAnimations} from "../../../../@fuse/animations";
import {ISelectModel} from "../../../shared/models/select.model";
import {BaseRequest} from "../../../models/base";

@Component({
    selector: 'app-staff',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss'],
    animations: fuseAnimations,
})
export class StaffComponent implements OnInit {
    @ViewChild(StaffDetailComponent) public detail: StaffDetailComponent;

    public seletedId: number = 0;
    public isShowDetail = false;
    searchPayload: BaseRequest = {
        page: 0,
        limit: 10,
    };

    /**
     * screenMode
     * 0: add
     * 1: update
     * 2: view
     */
    public screenMode: number = 0;
    private _dataSearchDialog: object;
    private lstDepartments: IDropList[] = [];
    private lstPositionCode: IDropList[] = [];

    public departments: Array<AdmDepartmentsDTO> = [];
    public departmentsDrop: Array<ISelectModel> = [];
    public genders: Array<ISelectModel> = [];
    public roles: Array<ISelectModel> = [];
    public positions: Array<ISelectModel> = [];

    constructor(
        public _staffService: ManagementStaffService,
        public _departmentsService: DepartmentsService,
        private _matDialog: MatDialog,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
    ) {
    }

    ngOnInit(): void {
        this.initDepartments();
        this._staffService.getPrepareLoadingPage().subscribe((res) => {
            //departments
            if (res.payload.departments != undefined && res.payload.departments.length > 0) {
                this.lstDepartments.push({label: 'Tẩt cả', value: ''});
                res.payload.departments.forEach(x => this.lstDepartments.push({
                    label: x.departmentName,
                    value: x.admDepartmentsId
                }));
            }
            //positionCode
            if (res.payload.positionCode != undefined && res.payload.positionCode.length > 0) {
                this.lstPositionCode.push({label: 'Tẩt cả', value: ''});
                res.payload.positionCode.forEach(x => this.lstPositionCode.push({
                    label: x.categoriesName,
                    value: x.admCategoriesId
                }));
            }
            /* if (res.payload.lstReasons != undefined && res.payload.lstReasons.length > 0) {
                 this.lstReasons.push({label: 'Tẩt cả', value: ''});
                 res.payload.lstReasons.forEach(x => this.lstReasons.push({label: x.categoriesName, value: x.admCategoriesId}));
             }*/
            this.departmentsDrop = res.payload.departments.map(el => ({
                id: el.admDepartmentsId,
                label: el.departmentName
            }));
            this.genders = res.payload.sex.map(el => ({
                id: el.admCategoriesId,
                label: el.categoriesName
            }));
            this.roles = res.payload.groupRole.map(el => ({
                id: el.admGroupRoleId,
                label: el.groupRoleName
            }));
            this.positions = res.payload.positionCode.map(el => ({
                id: el.admCategoriesId,
                label: el.categoriesName
            }));
        });
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            page: event.pageIndex,
            limit: event.pageSize,
        }
        let requestStaff = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            admDepartmentsId: this.seletedId > 0 ? this.seletedId : undefined,
        };
        this._staffService.doSearch(requestStaff).subscribe();
    }

    public handleSearch($event: Event): void {
        let requestStaff = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            admDepartmentsId: this.seletedId > 0 ? this.seletedId : undefined,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._staffService.doSearch(requestStaff).subscribe();
    }

    public handleAdvancedSearch($event: ButtonTableEvent): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            disableClose: true,
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('fullName', 'Họ và tên', null, false),
                        new InputSearch('accountName', 'Tên tài khoản', null, false),
                        new DropListSearch('admDepartmentsId', 'Phòng ban', this.lstDepartments, null, false),
                        new DropListSearch('admCategoriesId', 'Chức vụ', this.lstPositionCode, null, false),
                        new DropListSearch('accountStatus', 'Trạng thái', [
                            {label: 'Tất cả', value: ''},
                            {label: 'Hoạt động', value: UserStatus.ACTIVE},
                            {label: 'Tài khoản bị khoá', value: UserStatus.LOCKED},
                            {label: 'Đóng', value: UserStatus.CLOSED},
                        ], null, false),
                    ]
                },
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.btnSearchClicked.subscribe(
            (response) => {
                if (response.action === 'reset') {
                    this._staffService.doSearch({admDepartmentsId: this.seletedId > 0 ? this.seletedId : undefined}).subscribe();
                } else if (response.action === 'search') {
                    this._staffService.doSearch({
                        ...response.form.value,
                        // ...this.searchPayload,
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    public viewUserDetail(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this._staffService.createNewDetail();
                this.screenMode = 0;
                this.isShowDetail = true;
                break;
            case 'view':
                this.screenMode = 2;
                this._staffService.getDetail( {admAccountDetailId:
                    (event.rowItem as AdmAccountDetailDTO).admAccountDetailId}).subscribe(res => this.isShowDetail = true);
                break;
            case 'edit':
                this.screenMode = 1;
                this._staffService.getDetail( {admAccountDetailId:
                    (event.rowItem as AdmAccountDetailDTO).admAccountDetailId}).subscribe(res => this.isShowDetail = true);
                break;
            case 'lock':
                const dialogRef = this._confirmService.open({
                    title: 'Xác nhận khoá tài khoản?',
                    message: '',
                    actions: {
                        confirm: {
                            label: 'Đồng ý'
                        },
                        cancel: {
                            label: 'Hủy',
                        }
                    }
                });
                dialogRef.afterClosed().subscribe((result) => {
                    if (result === 'confirmed') {
                        const requestLock = (event.rowItem as AdmAccountDetailDTO[]).map(x => x.admAccountId);
                        this._staffService.lockAll({ids: requestLock}).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Khóa tài khoản thành công');
                                this.initStaffList();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                            }
                        });
                    }
                });
                break;
            case 'unlock':
                const dialogRef2 = this._confirmService.open({
                    title: 'Xác nhận mở khoá tài khoản?',
                    message: '',
                    actions: {
                        confirm: {
                            label: 'Đồng ý'
                        },
                        cancel: {
                            label: 'Hủy',
                        }
                    }
                });
                dialogRef2.afterClosed().subscribe((result) => {
                    if (result === 'confirmed') {
                        const requestUnlock = (event.rowItem as AdmAccountDetailDTO[]).map(x => x.admAccountId);
                        this._staffService.unlockAll({ids: requestUnlock}).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Mở khóa tài khoản thành công');
                                this.initStaffList();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                            }
                        });
                    }
                });

                break;
            default:
                break;
        }
    }

    public handleBack(event: boolean): void {
        if (event) {
            this.isShowDetail = false;
        }
    }

    public onSelectionDepartment(event: MatSelectionListChange): void {
        this.seletedId = event.options.at(0).value;
    }

    private initDepartments(): void {
        this._departmentsService.getAllActive().subscribe((res) => {
            this.departments = res.payload;
        });
    }

    initStaffList(): void {
        let requestStaff = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            admDepartmentsId: this.seletedId > 0 ? this.seletedId : undefined,
        };
        this._staffService.doSearch(requestStaff).subscribe();
    }

}
