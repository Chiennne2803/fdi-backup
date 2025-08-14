import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {ProfilesManagementService} from 'app/service';
import {forkJoin, Observable} from 'rxjs';
import {
    TABLE_BUTTON_ACTION_CONFIG,
    TABLE_PROFILE_RECEPTION_CONFIG,
    TASK_BAR_CONFIG
} from '../profiles-management.config';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {GroupSearchComponent} from '../../../../shared/components/group-search/group-search.component';
import {MatDialog} from '@angular/material/dialog';
import {ButtonConfig} from '../../../../shared/models/datatable/task-bar.model';
import {FsLoanProfilesDTO} from '../../../../models/service';
import {DialogProcess1Component} from '../archive/detail/process-dialogs/dialog-process-1.component';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {
    DropListSearch,
    FromToSearch,
    IDropList,
    InputSearch
} from "../../../../shared/components/group-search/search-config.models";
import {DialogService} from "../../../../service/common-service/dialog.service";
import {AuthService} from "../../../../core/auth/auth.service";
import {DialogProcess3Component} from "../archive/detail/process-dialogs/dialog-process-3.component";
import {ActivatedRoute} from "@angular/router";
import { ProfilesManagementComponent } from '../profiles-management.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'profiles-reception',
    templateUrl: './profiles-reception.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ProfilesReceptionComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    public _tableConfig = TABLE_PROFILE_RECEPTION_CONFIG;
    public _tableButtonConfig = {
        ...TABLE_BUTTON_ACTION_CONFIG,
        otherBtn: [
            new ButtonConfig('SFF_PROFILE_RECEIPT_SALE_MANAGER_APPROVE,SFF_PROFILE_RECEIPT_HEAD_OF_APPRAISAL_APPROVE', true, false, 'Giao rà soát', 'feather:refresh-ccw', 'add'),
            new ButtonConfig('SFF_PROFILE_RECEIPT_BUSINESS_SALE_APPROVE,SFF_PROFILE_RECEIPT_APPRAISAL_STAFF_APPROVE', true, false, 'Tiếp nhận', 'feather:refresh-ccw', 'approve'),
        ]
    };
    public _taskbarConfig = TASK_BAR_CONFIG;

    public _dataSource$: Observable<BaseResponse>;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    private listInvestmentTime: IDropList[] = [];
    private lstReasons: IDropList[] = [];
    private screenMode: string;
    /**
     * Constructor
     */
    constructor(
        private _profilesManagementService: ProfilesManagementService,
        private matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _dialogService: DialogService,
        private _authService: AuthService,
        private route: ActivatedRoute,
        private _profilesManagementComponent: ProfilesManagementComponent
    ) {
        this.route.params.subscribe(params => {
            this.screenMode = params['key'];
            this.searchPayload = {
                ...this.searchPayload,
                screenMode: this.screenMode
            }
            this._profilesManagementService.doSearchLoanProfileReception(this.searchPayload).subscribe(() => {
                this._tableConfig.isViewDetail = false;
                this._profilesManagementService.closeDetailDrawer();
            });
        });
    }
    toggleDrawer(): void
    {
        // Toggle the drawer
        this._profilesManagementComponent.matDrawer.toggle();
    }

    ngOnInit(): void {

        this._dataSource$ = this._profilesManagementService.lazyLoad;
        this._profilesManagementService.setDrawer(this.matDrawer);
        this._profilesManagementService.getPrepareLoadingPage().subscribe((res) => {
            if (res.payload.listInvestmentTime != undefined && res.payload.listInvestmentTime.length > 0) {
                this.listInvestmentTime.push({label: 'Tẩt cả', value: null});
                res.payload.listInvestmentTime.forEach(x => this.listInvestmentTime.push({label: x, value: x}));
            }
            if (res.payload.lstReasons != undefined && res.payload.lstReasons.length > 0) {
                this.lstReasons.push({label: 'Tẩt cả', value: null});
                res.payload.lstReasons.forEach(x => this.lstReasons.push({label: x.categoriesName, value: x.admCategoriesId}));
            }
        });
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._profilesManagementService.doSearchLoanProfileReception(this.searchPayload).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._profilesManagementService.doSearchLoanProfileReception(this.searchPayload).subscribe();
    }

    public handleRowClick(row: any): void {
        this._profilesManagementService
            .getDetail({ fsLoanProfilesId: row.fsLoanProfilesId })
            .subscribe((res) => {
                this._profilesManagementService.openDetailDrawer();
            });
    }

    handleCloseDetailPanel($event: Event): void {
        this._tableConfig.isViewDetail = false;
    }

    public handleTableEvent(event: ButtonTableEvent): void {
        let profiles;
        let confirmDialog;
        let oldStatusProcess = null;
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'add':
                profiles = event.data as FsLoanProfilesDTO[];

                profiles.map(profile => {
                    if (oldStatusProcess == null) {
                        oldStatusProcess = profile.processStatus;
                    } else if (oldStatusProcess !== profile.processStatus) {
                        this._fuseAlertService.showMessageError("Chỉ giao rà soát hồ sơ cùng trạng thái")
                        oldStatusProcess = null;
                        return;
                    }
                })
                if (oldStatusProcess) {
                    this._profilesManagementService
                        .getDetail({fsLoanProfilesId: profiles[0].fsLoanProfilesId})
                        .subscribe((res) => {
                            if (oldStatusProcess == 1) {
                                const dialogRef = this.matDialog.open(DialogProcess1Component, {
                                    width: '400px',
                                    data: {
                                        lstApprovedByProcess1: res.payload.lstApprovedByProcess1,
                                    },
                                });
                                dialogRef.componentInstance.onSubmit.subscribe(
                                    (response) => {
                                        forkJoin(
                                            profiles.map(profile => this._profilesManagementService.doProcess1({
                                                ...response,
                                                fsLoanProfilesId: profile.fsLoanProfilesId
                                            }))
                                        ).subscribe(() => {
                                            this._fuseAlertService.showMessageSuccess('Chuyển xử lý hồ sơ thành công');
                                            this._profilesManagementService.doSearchLoanProfileReception(this.searchPayload).subscribe();
                                            dialogRef.close();
                                        });
                                    }
                                );
                            } else {
                                const dialogRef = this.matDialog.open(DialogProcess3Component, {
                                    width: '400px',
                                    data: {
                                        lstApprovedByProcess3: res.payload.lstApprovedByProcess3,
                                    },
                                });
                                dialogRef.componentInstance.onSubmit.subscribe(
                                    (response) => {
                                        forkJoin(
                                            profiles.map(profile => this._profilesManagementService.doProcess3({
                                                ...response,
                                                fsLoanProfilesId: profile.fsLoanProfilesId
                                            }))
                                        ).subscribe(() => {
                                            this._fuseAlertService.showMessageSuccess('Chuyển xử lý hồ sơ thành công');
                                            this._profilesManagementService.doSearchLoanProfileReception(this.searchPayload).subscribe();
                                            dialogRef.close();
                                        });
                                    }
                                );
                            }
                        });
                }
                break;
            case 'approve':
                profiles = event.data as FsLoanProfilesDTO[];
                profiles.map(profile => {
                    if (oldStatusProcess == null) {
                        oldStatusProcess = profile.processStatus;
                    } else if (oldStatusProcess !== profile.processStatus) {
                        this._fuseAlertService.showMessageError("Chỉ tiếp nhận hồ sơ cùng trạng thái")
                        oldStatusProcess = null;
                        return;
                    }
                })

                if (oldStatusProcess) {
                    confirmDialog = this._dialogService.openConfirmDialog(oldStatusProcess == 1 ? 'Tiếp nhận hồ sơ kinh doanh ?' : 'Tiếp nhận hồ sơ thẩm định ?');
                    confirmDialog.afterClosed().subscribe((res) => {
                        if (res === 'confirmed') {
                            if (oldStatusProcess == 1) {
                                forkJoin(
                                    profiles.map(profile => this._profilesManagementService.doProcess1({
                                        approvalBy: this._authService.authenticatedUser.admAccountId,
                                        fsLoanProfilesId: profile.fsLoanProfilesId
                                    }))
                                ).subscribe(() => {
                                    this._fuseAlertService.showMessageSuccess('Tiếp nhận hồ sơ thành công');
                                    this._profilesManagementService.doSearchLoanProfileReception(this.searchPayload).subscribe();
                                });
                            } else {
                                forkJoin(
                                    profiles.map(profile => this._profilesManagementService.doProcess3({
                                        approvalBy: this._authService.authenticatedUser.admAccountId,
                                        fsLoanProfilesId: profile.fsLoanProfilesId
                                    }))
                                ).subscribe(() => {
                                    this._fuseAlertService.showMessageSuccess('Tiếp nhận hồ sơ thành công');
                                    this._profilesManagementService.doSearchLoanProfileReception(this.searchPayload).subscribe();
                                });
                            }
                        }
                    });
                }
                break;
            default:

                break;
        }
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this.matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ', null, false),
                        new InputSearch('createdByName', 'Người lập', null, false),
                        new InputSearch('fullName', 'Bên huy động vốn', null, false),
                        new DropListSearch('loanTimeCycle', 'Kỳ hạn(ngày)', this.listInvestmentTime, null, false),
                        new DropListSearch('reasons', 'Mục đích huy động vốn', this.lstReasons, null, false),
                        new FromToSearch('amount', 'Số tiền cần huy động (VNĐ)', null, 'number'),
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
                    this._profilesManagementService.doSearchLoanProfileReception(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._profilesManagementService.doSearchLoanProfileReception({
                        ...response.form.value,
                        ...this.searchPayload
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
