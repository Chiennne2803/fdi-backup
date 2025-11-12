import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { FsAccountInfoReqDTO } from 'app/models/service/FsAccountInfoReqDTO.model';
import { ManagementAccountInfoReqService } from 'app/service/admin/management-account-info-req.service';
import { Observable } from 'rxjs';
import { TABLE_BUTTON_ACTION_CONFIG_PERSONAL_INFO, TABLE_PERSONAL_INFO_CONFIG, TASK_BAR_CONFIG_PERSONAL_INFO } from './personal-info.config';
import {ButtonTableEvent} from "../../../shared/models/datatable/table-config.model";
import {GroupSearchComponent} from "../../../shared/components/group-search/group-search.component";
import {
    DateTimeSearch,
    DropListSearch,
    InputSearch
} from "../../../shared/components/group-search/search-config.models";
import {MatDialog} from "@angular/material/dialog";
import {FS_ACCOUNT_INFO_REQ_STATUS} from "../../../enum/fs-account-info-req.enum";
import {ButtonConfig} from "../../../shared/models/datatable/task-bar.model";
import {ConfirmProcessingComponent} from "../../../shared/components/confirm-processing/confirm-processing.component";
import {FuseAlertService} from "../../../../@fuse/components/alert";

@Component({
    selector: 'app-personal-info',
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = TABLE_PERSONAL_INFO_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_PERSONAL_INFO;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_PERSONAL_INFO;
    public detailId = 0;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;

    constructor(
        private _dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _managementAccountInfoReqService: ManagementAccountInfoReqService
    ) { }

    ngOnInit(): void {
        this._managementAccountInfoReqService.setDrawer(this.matDrawer);
        this._dataSource = this._managementAccountInfoReqService._search;
    }


    handleRowClick(event: FsAccountInfoReqDTO): void {
        this.detailId = event.fsAccountInfoReqId;
        this._managementAccountInfoReqService.getDetail( {fsAccountInfoReqId : event.fsAccountInfoReqId}).subscribe(res => {
            this._managementAccountInfoReqService.openDetailDrawer();
        });

    }

    handleCloseDetailPanel(event: any): void {
        if (event) {
            // this._decentralizedService.waitProcessTransaction().subscribe((res) => {
            //     this._dataSource = of(res);
            // });
        }
        this._managementAccountInfoReqService.closeDetailDrawer();
        this._tableConfig.isViewDetail = false;
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            page: event.pageIndex,
            limit: event.pageSize,
        };
        this._managementAccountInfoReqService.search(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._managementAccountInfoReqService.search(this.searchPayload).subscribe();
    }
    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'approve':
                const dialogRef = this._dialog.open(ConfirmProcessingComponent, {
                    disableClose: true,
                    // width: '450px',
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
                        const request = new FsAccountInfoReqDTO();
                        request.fsAccountInfoReqId = (event.rowItem as FsAccountInfoReqDTO[])[0].fsAccountInfoReqId;
                        request.status = response.status;
                        request.approvalInfo = response.approvalComment;
                        this._managementAccountInfoReqService.approvalChangeInfoReq(request).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._managementAccountInfoReqService.search(this.searchPayload).subscribe();
                                this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                                dialogRef.close();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                            }
                        });
                    }
                );
                break;
            default:
                break;
        }
    }

    checkboxItemChange(rows): void {
        const onlyDraft = rows.filter(item => item.status !== 1).length == 0;
        let lstOtherBtn: ButtonConfig[] = [];
        if (onlyDraft) {
            lstOtherBtn.push(new ButtonConfig('SFF_CHANGE_ID_APPROVE', false, true, 'Phê duyệt', 'mat_outline:playlist_add_check', 'approve'));
        }
        this._btnConfig = {
            commonBtn: [
                {type : 'export', role : 'SFF_CHANGE_ID_EXPORT', fileName : 'Thay_doi_ID'},
            ],
            otherBtn: [
                ...lstOtherBtn,
            ]
        };
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('transCode', 'Mã yêu cầu', null, false),
                        new InputSearch('createdByName', 'Người yêu cầu', null, false),
                        new DropListSearch('type', 'Loại yêu cầu', [
                            {label: 'Tẩt cả', value: ''},
                            {label: 'CCCD/Hộ chiếu', value: 1},
                            {label: 'Giấy phép kinh doanh', value: 2}
                        ], null),
                        new DateTimeSearch('createdDate','Ngày yêu cầu',null,false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: ''},
                            {label: 'Chờ xử lý', value: FS_ACCOUNT_INFO_REQ_STATUS.WAITING_PROGRESSING},
                            {label: 'Phê duyệt', value: FS_ACCOUNT_INFO_REQ_STATUS.APPROVE},
                            {label: 'Từ chối', value: FS_ACCOUNT_INFO_REQ_STATUS.REJECT}
                        ], null),
                        new InputSearch('transCode', 'Nội dung xử lý', null, false),
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
                    this._managementAccountInfoReqService.search({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._managementAccountInfoReqService.search(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
