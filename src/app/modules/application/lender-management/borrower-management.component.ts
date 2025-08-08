import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {ManagementLenderService} from 'app/service';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {forkJoin, Observable} from 'rxjs';
import {TABLE_BORROWER_MANAGEMENT_CONFIG, TASK_BAR_BORROWER_MANAGEMENT_CONFIG} from './borrower-management.config';
import {MatDrawer} from '@angular/material/sidenav';
import {ROUTER_CONST} from '../../../shared/constants';
import {ConfirmTypeDialogComponent} from './confirm-type-dialog/confirm-type-dialog.component';
import {GroupSearchComponent} from '../../../shared/components/group-search/group-search.component';
import {DropListSearch, IDropList, InputSearch} from '../../../shared/components/group-search/search-config.models';
import {AccountDetailStatus, UserStatus, UserType} from '../../../enum';
import {TABLE_BUTTON_ACTION_CONFIG} from "../investor-management/investor-management.config";
import {ButtonConfig, CommonButtonConfig} from "../../../shared/models/datatable/task-bar.model";
import {AdmAccountDetailDTO} from "../../../models/admin";
import {ConfirmProcessingComponent} from "../../../shared/components/confirm-processing/confirm-processing.component";
import {ManageStaffDialogsComponent} from "../investor-management/manager-staff-dialog/manager-staff-dialog.component";
import {FuseAlertService} from "../../../../@fuse/components/alert";
import {DialogService} from "../../../service/common-service/dialog.service";

@Component({
    selector: 'app-borrower-management',
    templateUrl: './borrower-management.component.html',
    styleUrls: ['./borrower-management.component.scss']
})
export class BorrowerManagementComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _tableInvestorManagementConfig = TABLE_BORROWER_MANAGEMENT_CONFIG;
    public _taskBarConfig = TASK_BAR_BORROWER_MANAGEMENT_CONFIG;
    public _tableButtonConfig = TABLE_BUTTON_ACTION_CONFIG;
    public _dataSource$: Observable<BaseResponse>;

    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    lstManagerStaff: AdmAccountDetailDTO[];
    private _listUser: IDropList[] = [];
    constructor(
        private _dialogService: DialogService,
        private _managementLenderService: ManagementLenderService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _router: Router
    ) {
    }

    ngOnInit(): void {
        this._managementLenderService.doSearch(this.searchPayload).subscribe();
        this._dataSource$ = this._managementLenderService.lazyLoad;
        this._dataSource$.subscribe((value) => {
            if(value?.content?.length > 0) {
                value.content.forEach((acc: AdmAccountDetailDTO) => {
                    if (acc.type == UserType.DOANH_NGHIEP) {
                        acc.taxCode = acc.businessCode;
                    }
                })
            }
        });
        this._managementLenderService.setDrawer(this.matDrawer);

        this._managementLenderService.prepareLender$.subscribe(res => {
            if (res.lstManagerStaff) {
                this.lstManagerStaff = res.lstManagerStaff;
                if (this.lstManagerStaff != undefined && this.lstManagerStaff.length > 0) {
                    this._listUser = [];
                    this._listUser.push({label: 'Tẩt cả', value: null});
                    this.lstManagerStaff.forEach(el => this._listUser.push({
                        label: el.fullName,
                        value: el.admAccountDetailId
                    }));
                }
            }
        })
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._managementLenderService.doSearch(this.searchPayload).subscribe();
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                const dialogConfig = new MatDialogConfig();
                dialogConfig.autoFocus = true;
                dialogConfig.disableClose = true;
                dialogConfig.width = '480px'; // nhỏ gọn hơn
                dialogConfig.maxWidth = '480px'; // responsive
                const dialog = this._matDialog.open(ConfirmTypeDialogComponent, dialogConfig);
                dialog.afterClosed().subscribe((res: number) => {
                    if (res) {
                        this._router.navigate([ROUTER_CONST.config.application.borrower.add], {queryParams: {type: res}});
                    }
                });
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'lock':
                const confirmDialog = this._dialogService.openConfirmDialog('Tài khoản sẽ bị dừng hoạt động, xác nhận thực hiện');
                confirmDialog.afterClosed().subscribe((res) => {
                    if (res === 'confirmed') {
                        const requestLock = (event.rowItem as AdmAccountDetailDTO[]).map(x => x.admAccountId);
                        this._managementLenderService.lockAll({
                            ids: requestLock
                        }).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Khóa tài khoản thành công');
                                this._managementLenderService.doSearch(this.searchPayload).subscribe();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                            }
                        });
                    }
                });
                break;
            case 'unlock':
                const confirmDialog2 = this._dialogService.openConfirmDialog('Tài khoản sẽ khôi phục, xác nhận thực hiện');
                confirmDialog2.afterClosed().subscribe((res) => {
                    if (res === 'confirmed') {
                        const requestUnlock = (event.rowItem as AdmAccountDetailDTO[]).map(x => x.admAccountId);
                        this._managementLenderService.unlockAll({
                            ids: requestUnlock
                        }).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Mở khóa tài khoản thành công');
                                this._managementLenderService.doSearch(this.searchPayload).subscribe();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                            }
                        });
                    }
                });
                break;
            case 'approve':
                const dialogRef = this._matDialog.open(ConfirmProcessingComponent, {
                    width: '450px',
                    disableClose: true,
                    data: {
                        title: 'Xác nhận nội dung xử lý',
                        valueDefault: 2,
                        valueReject: 3,
                        choices: [
                            {
                                value: 2,
                                name: 'Phê duyệt',
                            },
                            {
                                value: 3,
                                name: 'Từ chối(Ghi rõ lý do)',
                            }
                        ],
                        complete: () => {
                            dialogRef.close();
                        },
                    },
                });
                dialogRef.componentInstance.onSubmit.subscribe(
                    (response) => {
                        forkJoin(
                            (event.data as AdmAccountDetailDTO[]).map(account => this._managementLenderService.approvalLender({
                                ...response,
                                reasonContent: response.approvalComment,
                                admAccountId: account.admAccountId
                            }))
                        ).subscribe((res) => {
                            this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                            this._managementLenderService.doSearch(this.searchPayload).subscribe();
                            dialogRef.close();
                        });
                    }
                );
                break;
            case 'update-rate':
                const dialogManageStaff = this._matDialog.open(ManageStaffDialogsComponent, {
                    width: '400px',
                    disableClose: true,
                    data: {
                        lstManagerStaff: this.lstManagerStaff,
                    },
                });
                dialogManageStaff.componentInstance.onSubmit.subscribe(
                    (response) => {
                        this._managementLenderService.setManageStaff({
                            manageStaff: response.managerStaff,
                            admAccountIds: (event.data as AdmAccountDetailDTO[]).map(account => account.admAccountId)
                        }).subscribe(resDto => {
                            if (resDto.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                                this._managementLenderService.doSearch(this.searchPayload).subscribe();
                            } else {
                                this._fuseAlertService.showMessageError(resDto.message.toString());
                            }
                            dialogManageStaff.close();
                        });
                    }
                );
                break;
            default:
                break;
        }
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            page: event.pageIndex,
            limit: event.pageSize,
        };
        this._managementLenderService.doSearch(this.searchPayload).subscribe();
        this._dataSource$ = this._managementLenderService._lenders;
    }

    handleRowClick(row): void {
        this._managementLenderService
            .getDetail({admAccountDetailId: row.admAccountDetailId})
            .subscribe(() => {
                this._managementLenderService.openDetailDrawer();
            });
    }

    handleCloseDetailPanel($event: Event) {
        this._tableInvestorManagementConfig.isViewDetail = false;
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            disableClose: true,
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new DropListSearch('type', 'Đối tượng', [
                            {label: 'Tất cả', value: ''},
                            {label: 'Cá nhân', value: UserType.CA_NHAN},
                            {label: 'Doanh nghiệp', value: UserType.DOANH_NGHIEP},
                        ], null, false),
                        new DropListSearch('status', 'Trạng thái xác minh', [
                            {label: 'Tất cả', value: ''},
                            {label: 'Chưa xác minh', value: AccountDetailStatus.WAIT_CONFIRM},
                            {label: 'Chờ phê duyệt', value: AccountDetailStatus.WAIT_APPROVE},
                            {label: 'Đã phê duyệt', value: AccountDetailStatus.ACTIVE},
                            {label: 'Từ chối', value: AccountDetailStatus.REJECT},
                        ], null, false),
                        new InputSearch('createdByName', 'Người tạo', null, false),
                        new DropListSearch('accountStatus', 'Trạng thái tài khoản', [
                            {label: 'Tất cả', value: ''},
                            {label: 'Hoạt động', value: UserStatus.ACTIVE},
                            {label: 'Tài khoản bị khoá', value: UserStatus.LOCKED},
                            {label: 'Đóng', value: UserStatus.CLOSED},
                        ], null, false),
                        new InputSearch('accountName', 'Tên tài khoản', null, false),
                        new InputSearch('fullName', 'Họ và tên', null, false),
                        new InputSearch('mobile', 'Số điện thoại', null, false),
                        new InputSearch('email', 'Email', null, false),
                        new InputSearch('businessLicense', 'Số GPKD', null, false),
                        new InputSearch('identification', 'Số CMT / Hộ chiếu', null, false),
                        new DropListSearch('manageStaff', 'Người phụ trách', this._listUser, null, false)
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
                    this._managementLenderService.doSearch().subscribe();
                } else if (response.action === 'search') {
                    this._managementLenderService.doSearch({
                        ...response.form.value,
                        ...this.searchPayload,
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    checkboxItemChange(rows): void {
        const isAllWaitApprove = rows.filter(item => item.status === 1).length === rows.length;
        const hasActive = rows.filter(item => (item.accountStatus === 1)).length > 0;
        const hasDeactive = rows.filter(item => item.accountStatus !== 1).length > 0;
        const hasClose = rows.filter(item => item.accountStatus === 3).length > 0;

        let lstCommonBtn: CommonButtonConfig[] = [];
        let lstOtherBtn: ButtonConfig[] = [];
        if (isAllWaitApprove && !hasDeactive) {
            lstOtherBtn.push(new ButtonConfig('SFF_BORROWER_UPDATE', false, true, 'Phê duyệt', 'mat_outline:playlist_add_check', 'approve'));
        }
        if (hasActive && hasDeactive || hasClose) {
            //ko co
        } else if (hasDeactive) {
            lstCommonBtn.push({type: 'unlock', role: 'SFF_BORROWER_UPDATE'});
        } else if (hasActive) {
            lstCommonBtn.push({type: 'lock', role: 'SFF_BORROWER_UPDATE'});
        }

        this._tableButtonConfig = {
            commonBtn: [
                ...lstCommonBtn,
                {type: 'export', role: 'SFF_BORROWER_EXPORT', fileName : 'Danh_sach_ben_huy_dong_von'},
            ],
            otherBtn: [
                ...lstOtherBtn,
                new ButtonConfig(null, false, true, 'Phân quản lý', 'mat_outline:playlist_add_check', 'update-rate')
            ]
        };
    }
}
