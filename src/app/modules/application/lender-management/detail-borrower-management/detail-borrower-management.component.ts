import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {
    AccountDetailStatus,
    AdmAccountDetailDTO,
    AdmCategoriesDTO,
    FsDocuments,
    UserType
} from '../../../../models/admin';
import {FileService} from '../../../../service/common-service';
import {ManagementLenderService, ProfilesManagementService} from '../../../../service';
import {
    ConfirmProcessingComponent
} from '../../../../shared/components/confirm-processing/confirm-processing.component';
import {MatDialog} from '@angular/material/dialog';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {BaseRequest, BaseResponse} from '../../../../models/base';
import {MatDrawer} from '@angular/material/sidenav';
import {DeputyType} from '../../../../enum';
import {AdmCollateralDTO} from '../../../../models/admin/AdmCollateralDTO.model';
import {CreateCreditLimitDialogsComponent} from './create-credit-limit/create-credit-limit-dialogs.component';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {SelectionModel} from '@angular/cdk/collections';
import {ROUTER_CONST} from "../../../../shared/constants";
import {ManageStaffDialogsComponent} from "../../investor-management/manager-staff-dialog/manager-staff-dialog.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../core/auth/auth.service";
import {DateTimeformatPipe} from "../../../../shared/components/pipe/date-time-format.pipe";
import {ISelectModel} from "../../../../shared/models/select.model";
import {DialogService} from "../../../../service/common-service/dialog.service";
import {ValuationHistoryDialogComponent} from "./create-collateral-history/valuation-history-dialog.component";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {environment} from "../../../../../environments/environment";
import {AdmValuationHistoryDTO} from "../../../../models/admin/AdmValuationHistoryDTO.model";
import {CreateCustomerRankDialogsComponent} from "./create-customer-rank/create-customer-rank-dialogs.component";
import {CheckboxColumn, TextColumn} from "../../../../shared/models/datatable/display-column.model";
import {ExcelService} from "../../../../service/common-service/excel.service";
import {FsLoanProfilesDTO} from "../../../../models/service";

@Component({
    selector: 'app-detail-borrower-management',
    templateUrl: './detail-borrower-management.component.html',
    styleUrls: ['./detail-borrower-management.component.scss'],
    animations: fuseAnimations,
    providers: [DateTimeformatPipe]
})
export class DetailBorrowerManagementComponent implements OnInit {
    @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @Output() public handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();

    public status: Array<ISelectModel> = [
        {id: 1, label: 'Hoạt động'},
        {id: 0, label: 'Không hoạt động'}
    ];
    public deputyAvatar: FsDocuments;
    public detail: Observable<AdmAccountDetailDTO>;
    public maxLoan;
    public userType = UserType;
    public accountDetailStatus = AccountDetailStatus;
    public admAccountId: number;
    public accTypeCN: boolean;
    public accTypeDN: boolean;
    public oldFrontPhotoIdentication: string;
    public oldBacksitePhotoIdentication: string;

    public selectedFile: FsDocuments;
    public selectedAdmCollateral: AdmCollateralDTO;
    public deputyType = DeputyType;
    public hasReplaceBtn: boolean = false;
    public avatar: FsDocuments;
    public selectionLoan = new SelectionModel<FsLoanProfilesDTO>(true, []);
    public loanProfilesDTOS: FsLoanProfilesDTO[];
    public lstManagerStaff: AdmAccountDetailDTO[];
    public cmnd: FsDocuments[];
    public laborContract: FsDocuments[];
    public rentalContract: FsDocuments[];
    public fileValues1: FsDocuments[];
    public fileValues2: FsDocuments[];
    public photoOfBusiness: FsDocuments[];
    public economicInfoDocuments: FsDocuments[];
    public financialDocuments: FsDocuments[];
    public financialDocuments1: FsDocuments[];
    public financialDocuments2: FsDocuments[];
    public financialDocuments3: FsDocuments[];
    public businessDocumentation: FsDocuments[];
    public businessDocumentation1: FsDocuments[];
    public businessDocumentation2: FsDocuments[];

    public isSrcCollateral: boolean;
    public collateralUpdateMode: string;
    public collateralType: AdmCategoriesDTO[];
    public collateralFileId: FsDocuments[];
    public assetType: AdmCategoriesDTO[];
    public formGroupCollateral: FormGroup;

    public pageSizeOptions = environment.pageSizeOptions;
    @ViewChild('valuationHistoryPaginator') valuationHistoryPaginator: MatPaginator;
    public valuationHistoryDataSource = new MatTableDataSource<any>();
    public valuationHistoryLengthRecords: number = 0;
    public valuationHistoryPageSize: number = 0;
    public legal_documents_Config: any[];
    public legal_documents_lst: string[] = [
        'Giấy chứng nhận đăng ký kinh doanh (bản thay đổi gần nhất)',
        'CCCD/Hộ Chiếu của Đại diện pháp luật và các cổ đông lớn nhất (mặt trước)',
        'CCCD/Hộ Chiếu của Đại diện pháp luật và các cổ đông lớn nhất  ( mặt sau)',
        'Đăng ký mẫu dấu, chứng chỉ ngành nghề hoặc giấy chứng nhận đủ điều kiện kinh doanh',
        'Quyết định bổ nhiệm kế toán trưởng',
        'Điều lệ công ty',
        'Danh sách thành viên Hội đồng quản trị/ Hội đồng thành viên',
        'Quyết định bổ nhiệm Người đại diện trước pháp luật',
        'Bản công bố các cá nhân liên quan (bố mẹ, vợ hoặc chồng) của Người chịu trách nhiệm trước pháp luật hoặc cổ đông lớn nhất'];

    constructor(
        private _managementLenderService: ManagementLenderService,
        private _profilesManagementService: ProfilesManagementService,
        private _router: Router,
        private _fb: FormBuilder,
        private _dialogService: DialogService,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _fileService: FileService,
        private _excelService: ExcelService,
    ) {
        this.legal_documents_Config = [{
            title: this.legal_documents_lst[0], key: 'legalDocuments', lstFile: [],
        }, {
            title: this.legal_documents_lst[1], key: 'legalDocuments1', lstFile: [],
        }, {
            title: this.legal_documents_lst[2], key: 'legalDocuments2', lstFile: [],
        }, {
            title: this.legal_documents_lst[3], key: 'legalDocuments3', lstFile: [],
        }, {
            title: this.legal_documents_lst[4], key: 'legalDocuments4', lstFile: [],
        }, {
            title: this.legal_documents_lst[5], key: 'legalDocuments5', lstFile: [],
        }, {
            title: this.legal_documents_lst[6], key: 'legalDocuments6', lstFile: [],
        }, {
            title: this.legal_documents_lst[7], key: 'legalDocuments7', lstFile: [],
        }, {
            title: this.legal_documents_lst[8], key: 'legalDocuments8', lstFile: [],
        },
        ]
    }

    ngOnInit(): void {
        this.initForm();
        this._profilesManagementService.setDrawer(this.matDrawer);
        this.detail = this._managementLenderService.detail$.pipe(
            tap((res) => {
                this.cmnd = [];
                this.laborContract = [];
                this.rentalContract = [];
                this.fileValues1 = [];
                this.fileValues2 = [];
                this.photoOfBusiness = [];
                this.economicInfoDocuments = [];
                this.financialDocuments = [];
                this.financialDocuments1 = [];
                this.financialDocuments2 = [];
                this.financialDocuments3 = [];
                this.businessDocumentation = [];
                this.businessDocumentation1 = [];
                this.businessDocumentation2 = [];

                if (res) {
                    this.isSrcCollateral = false;
                    this.accTypeCN = res.type === UserType.INDIVIDUAL;
                    this.accTypeDN = res.type === UserType.COMPANY
                    setTimeout(() => {
                        if (this.matTabGroup) {
                            if (res.tabIndex) {
                                this.matTabGroup._tabs?.forEach((tab: MatTab) => {
                                    if (tab.textLabel == res.tabIndex) {
                                        this.matTabGroup.selectedIndex = tab.position;
                                    }
                                })
                            } else {
                                this.matTabGroup.selectedIndex = 0;
                            }
                        }
                    }, 100);

                    this.loanProfilesDTOS = res.fsLoanProfilesDTOS;
                    if (res.admAccountId != undefined) {
                        this.admAccountId = res.admAccountId;
                    }

                    if (res.avatar) {
                        this._fileService.getFileFromServer(res.avatar).subscribe((file) => {
                            this.avatar = file.payload;
                        });
                    }

                    let idsmnd = res.frontPhotoIdentication + ";" + res.backsitePhotoIdentication;
                    idsmnd = idsmnd.replaceAll('undefined', '');
                    if (idsmnd !== ';') {
                        this._fileService.getDetailFiles(idsmnd).subscribe(result => this.cmnd = result.payload);
                        this.oldFrontPhotoIdentication = res.frontPhotoIdentication;
                        this.oldBacksitePhotoIdentication = res.frontPhotoIdentication;
                    }

                    if (res.laborContract) {
                        this._fileService
                            .getDetailFiles(res.laborContract)
                            .subscribe(result => this.laborContract = result.payload);
                    }
                    if (res.rentalContract) {
                        this._fileService
                            .getDetailFiles(res.rentalContract)
                            .subscribe(result => this.rentalContract = result.payload);
                    }
                    if (res.fileValues1) {
                        this._fileService
                            .getDetailFiles(res.fileValues1)
                            .subscribe(result => this.fileValues1 = result.payload);
                    }
                    if (res.fileValues2) {
                        this._fileService
                            .getDetailFiles(res.fileValues2)
                            .subscribe(result => this.fileValues2 = result.payload);
                    }
                    if (res.photoOfBusiness) {
                        this._fileService
                            .getDetailFiles(res.photoOfBusiness)
                            .subscribe(result => this.photoOfBusiness = result.payload);
                    }
                    if (res.economicInfoDocuments) {
                        this._fileService
                            .getDetailFiles(res.economicInfoDocuments)
                            .subscribe(result => this.economicInfoDocuments = result.payload);
                    }
                    if (res.financialDocuments) {
                        this._fileService
                            .getDetailFiles(res.financialDocuments)
                            .subscribe(result => this.financialDocuments = result.payload);
                    }
                    if (res.financialDocuments1) {
                        this._fileService
                            .getDetailFiles(res.financialDocuments1)
                            .subscribe(result => this.financialDocuments1 = result.payload);
                    }
                    if (res.financialDocuments2) {
                        this._fileService
                            .getDetailFiles(res.financialDocuments2)
                            .subscribe(result => this.financialDocuments2 = result.payload);
                    }
                    if (res.financialDocuments3) {
                        this._fileService
                            .getDetailFiles(res.financialDocuments3)
                            .subscribe(result => this.financialDocuments3 = result.payload);
                    }
                    if (res.businessDocumentation) {
                        this._fileService
                            .getDetailFiles(res.businessDocumentation)
                            .subscribe(result => this.businessDocumentation = result.payload);
                    }
                    if (res.businessDocumentation1) {
                        this._fileService
                            .getDetailFiles(res.businessDocumentation1)
                            .subscribe(result => this.businessDocumentation1 = result.payload);
                    }
                    if (res.businessDocumentation2) {
                        this._fileService
                            .getDetailFiles(res.businessDocumentation2)
                            .subscribe(result => this.businessDocumentation2 = result.payload);
                    }

                    if (res.legalDocuments) {
                        this._fileService.getDetailFiles(res.legalDocuments).subscribe(
                            files => this.legal_documents_Config.map(x => x.key == 'legalDocuments' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res.legalDocuments1) {
                        this._fileService.getDetailFiles(res.legalDocuments1).subscribe(
                            files => this.legal_documents_Config.map(x => x.key == 'legalDocuments1' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res.legalDocuments2) {
                        this._fileService.getDetailFiles(res.legalDocuments2).subscribe(
                            files => this.legal_documents_Config.map(x => x.key == 'legalDocuments2' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res.legalDocuments3) {
                        this._fileService.getDetailFiles(res.legalDocuments3).subscribe(
                            files => this.legal_documents_Config.map(x => x.key == 'legalDocuments3' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res.legalDocuments4) {
                        this._fileService.getDetailFiles(res.legalDocuments4).subscribe(
                            files => this.legal_documents_Config.map(x => x.key == 'legalDocuments4' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res.legalDocuments5) {
                        this._fileService.getDetailFiles(res.legalDocuments5).subscribe(
                            files => this.legal_documents_Config.map(x => x.key == 'legalDocuments5' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res.legalDocuments6) {
                        this._fileService.getDetailFiles(res.legalDocuments6).subscribe(
                            files => this.legal_documents_Config.map(x => x.key == 'legalDocuments6' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res.legalDocuments7) {
                        this._fileService.getDetailFiles(res.legalDocuments7).subscribe(
                            files => this.legal_documents_Config.map(x => x.key == 'legalDocuments7' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res.legalDocuments8) {
                        this._fileService.getDetailFiles(res.legalDocuments8).subscribe(
                            files => this.legal_documents_Config.map(x => x.key == 'legalDocuments8' ? x.lstFile = files.payload : x.lstFile));
                    }

                    if (res.representative?.avatar) {
                        this._fileService
                            .getFileFromServer(res.representative.avatar)
                            .subscribe(avatar => this.deputyAvatar = avatar.payload);
                    }
                    this.maxLoan = res.maxLoan;
                    this.initForm();
                }
            })
        );
        this._managementLenderService.prepareLender$.subscribe(res => {
            if (res.lstManagerStaff) {
                this.lstManagerStaff = res.lstManagerStaff;
            }
            if (res.collateralType) {
                this.collateralType = res.collateralType;
            }
            if (res.assetType) {
                this.assetType = res.assetType;
            }
        })
    }

    public setManageStaff(): void {
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
                    admAccountIds: [this.admAccountId]
                }).subscribe(resDto => {
                    if (resDto.errorCode === '0') {
                        this._managementLenderService
                            .getDetail({admAccountDetailId: this.admAccountId}).subscribe();
                        this._managementLenderService.doSearch().subscribe();
                        this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                    } else {
                        this._fuseAlertService.showMessageError(resDto.message.toString());
                    }
                    dialogManageStaff.close();
                });
            }
        );
    }

    public onClose(): void {
        this._managementLenderService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }

    public onCloseSrcCollateral(): void {
        this.isSrcCollateral = false;
        setTimeout(() => {
            if (this.matTabGroup) {
                this.matTabGroup._tabs?.forEach((tab: MatTab) => {
                    if (tab.textLabel == 'Thông tin tài sản bảo đảm') {
                        this.matTabGroup.selectedIndex = tab.position;
                    }
                })
            }
        }, 100);
    }

    public clickViewImage(id: string): void {
        this.hasReplaceBtn = false;
        this._fileService
            .getDetailFiles(id)
            .subscribe((res) => {
                if (res != undefined && res.payload != undefined) {
                    this.selectedFile = res.payload[0];
                    this.fileDrawer.open();
                    if (['JPG', 'JPEG', 'PNG'].includes(this.selectedFile.type.toUpperCase())) {
                        this._fileService.getFileFromServer(this.selectedFile.finDocumentsId + '').subscribe(
                            res => this.selectedFile = res.payload
                        );
                    }
                }
            });
    }

    public onClickFile(file: FsDocuments, colume?: string, admCollateral?: AdmCollateralDTO): void {
        this.hasReplaceBtn = true;
        if(file){
            this.selectedFile = file;
            if (admCollateral) {
                this.selectedAdmCollateral = admCollateral;
            }
            this.fileDrawer.open();
            if (['JPG', 'JPEG', 'PNG'].includes(file.type.toUpperCase())) {
                this._fileService.getFileFromServer(file.finDocumentsId + '').subscribe(
                    res => {
                        this.selectedFile = res.payload;
                        if (this.selectedFile.finDocumentsId.toString() == this.oldFrontPhotoIdentication) {
                            this.selectedFile.colume = "frontPhotoIdentication";
                        } else if (this.selectedFile.finDocumentsId.toString() == this.oldBacksitePhotoIdentication) {
                            this.selectedFile.colume = "backsitePhotoIdentication";
                        } else {
                            this.selectedFile.colume = colume;
                        }
                    }
                );
            }
        }else {
            this._fuseAlertService.showMessageWarning("Không có dữ liệu");
        }

    }
    // safeListFsDocuments(fsDocuments: FsDocuments[]) {
    //     if(fsDocuments && Array.isArray(fsDocuments)) {
    //         fsDocuments = fsDocuments.filter((el) => el !== null);
    //         return fsDocuments;
    //     }
    //     return [];
    // }

    public onClickProcess(): void {
        const dialogRef = this._matDialog.open(ConfirmProcessingComponent, {
            width: '450px',
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
                maxlenNote : 500,
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                this._managementLenderService.approvalLender({
                    ...response,
                    admAccountId: this.admAccountId,
                    reasonContent: response.approvalComment
                }).subscribe((res) => {
                    if (res.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                        this._managementLenderService.doSearch(new BaseRequest()).subscribe();
                        this.onClose();
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                    dialogRef.close();
                });
            }
        );
    }

    public openCreateCollateralDialog(): void {
        this.selectedAdmCollateral = undefined;
        this.isSrcCollateral = true;
        this.collateralUpdateMode = 'add';
        if (this.matTabGroup) {
            this.matTabGroup.selectedIndex = 0;
        }
        this.initForm();
    }

    public openCreateCreditLimitDialog(): void {
        this._matDialog.open(CreateCreditLimitDialogsComponent, {disableClose: true});
    }

    public openCreateCustomerRankDialog(): void {
        this._matDialog.open(CreateCustomerRankDialogsComponent, {disableClose: true});
    }

    public openValuationHistoryDialog(): void {
        this._matDialog.open(ValuationHistoryDialogComponent, {
            disableClose: true, data: {
                maxLoan: this.maxLoan,
                admCollateralDTO: this.selectedAdmCollateral
            }
        });
    }

    public onReplaceFile(file: FsDocuments): void {
        /* const oldFileID = this.selectedAdmCollateral.fileId.split(',');
         oldFileID[oldFileID.indexOf(this.selectedFile.finDocumentsId.toString())] = file.finDocumentsId.toString();
         const newFileID = oldFileID.join(',');
         this._managementLenderService.createOrUpdateCollateral({
             admCollateralId: this.selectedAdmCollateral.admCollateralId,
             collateralName: this.selectedAdmCollateral.collateralName,
             collateralType: this.selectedAdmCollateral.collateralType,
             fileId: newFileID,
         }).subscribe((res) => {
             if (res.errorCode === '0') {
                 this.fileDrawer.close();
                 this._fuseAlertService.showMessageSuccess('Thay thế file thành công');
                 this._managementLenderService.getDetail().subscribe();
             } else {
                 this._fuseAlertService.showMessageError(res.message.toString());
             }
         });*/
    }


    public getDetailProfile(row): void {
        this._profilesManagementService.getDetail(row).subscribe((res) => {
            this._profilesManagementService.openDetailDrawer();
        });
    }

    private initForm(admCollateralDTO?: AdmCollateralDTO) {
        this.formGroupCollateral = this._fb.group({
            admCollateralId: new FormControl(admCollateralDTO ? admCollateralDTO.admCollateralId : null),
            admAccountId: new FormControl(admCollateralDTO ? admCollateralDTO.admAccountId : this.admAccountId, Validators.required),
            collateralName: new FormControl(admCollateralDTO ? admCollateralDTO.collateralName : null, [Validators.required, Validators.maxLength(50)]),
            collateralType: new FormControl(admCollateralDTO ? admCollateralDTO.collateralType : null, Validators.required),
            info: new FormControl(admCollateralDTO ? admCollateralDTO.info : null),
            fileId: new FormControl(admCollateralDTO ? admCollateralDTO.fileId : null, Validators.required),
            status: new FormControl(admCollateralDTO ? admCollateralDTO.status : 1, Validators.required),
            guaranteedRate: new FormControl(admCollateralDTO ? admCollateralDTO.guaranteedRate : null, Validators.required),
            raisingCapital: new FormControl(admCollateralDTO ? admCollateralDTO.raisingCapital : null, Validators.required),
            amount: new FormControl({
                value: admCollateralDTO ? admCollateralDTO.amount : null,
                disabled: admCollateralDTO?.admCollateralId ? true : false
            }, [Validators.required, Validators.maxLength(15)]),

            createdByName: new FormControl({
                value: admCollateralDTO ? admCollateralDTO.createdByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: admCollateralDTO ? this._datetimePipe.transform(admCollateralDTO.createdDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            lastUpdatedByName: new FormControl({
                value: admCollateralDTO ? admCollateralDTO.lastUpdatedByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: admCollateralDTO ? this._datetimePipe.transform(admCollateralDTO.lastUpdatedDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
    }

    createOrUpdateCollateral() {
        this.formGroupCollateral.markAllAsTouched();
        if (this.formGroupCollateral.valid) {
            const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
            confirmDialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this._managementLenderService.createOrUpdateCollateral(this.selectedAdmCollateral ? {
                        ...this.formGroupCollateral.value,
                        amount: this.selectedAdmCollateral.amount
                    } : {
                        ...this.formGroupCollateral.value,
                    }).subscribe(res => {
                        if (res.errorCode === '0') {
                            this._fuseAlertService.showMessageSuccess('Dữ liệu đã được lưu thành công');
                            this._managementLenderService.getDetail({admAccountDetailId: this.admAccountId}, 'Thông tin tài sản bảo đảm').subscribe();
                            this.isSrcCollateral = false;
                        } else {
                            this._fuseAlertService.showMessageError(res.message.toString());
                        }
                    });
                }
            });
        }
    }

    updateCollateralMode(admCollateralDTO: AdmCollateralDTO) {
        this.selectedAdmCollateral = admCollateralDTO;
        this.isSrcCollateral = true;
        this.collateralUpdateMode = 'view';
        this.matTabGroup.selectedIndex = 0;
        if (admCollateralDTO.fileId) {
            this._fileService
                .getDetailFiles(admCollateralDTO.fileId)
                .subscribe(result => this.collateralFileId = result.payload);
        }
        this.initForm(admCollateralDTO);
        this._managementLenderService.getValuationHistory({
            admCollateralId: admCollateralDTO.admCollateralId,
            admAccountId: admCollateralDTO.admAccountId
        }).subscribe((res: any) => {
            if (res) {
                if (res.length > 0) {
                    res.map((obj: AdmValuationHistoryDTO) => {
                        if (obj.fileId) {
                            this._fileService
                                .getDetailFiles(obj.fileId)
                                .subscribe(result => obj.fileIdObj = result.payload);
                        }
                    })
                }
                this.valuationHistoryDataSource = new MatTableDataSource(res);
                this.valuationHistoryLengthRecords = res.length;
                setTimeout(() => this.valuationHistoryDataSource.paginator = this.valuationHistoryPaginator, 1000);
            }
        })

    }

    setModeEditCollateral() {
        this.collateralUpdateMode = 'edit';
    }

    getCollateralTypeName(collateralType: number) {
        if (collateralType) {
            return this.collateralType?.filter(c => c.admCategoriesId == collateralType)[0].categoriesName;
        }
    }

    getRaisingCapitalName(raisingCapital: number) {
        if (raisingCapital) {
            return this.assetType?.filter(c => c.admCategoriesId == raisingCapital)[0].categoriesName;
        }
    }

    upadteRate(maxloan: number, $event: Event) {
        var rate = (Number($event) / maxloan * 100).toFixed(3);
        this.formGroupCollateral.get('guaranteedRate').patchValue(rate);
        this.formGroupCollateral.get('guaranteedRate').updateValueAndValidity();
    }

    get checkDispalyBtnExportLoan(): boolean {
        return this.selectionLoan.selected.length > 0;
    }

    isAllLoanSelected(): boolean {
        const numSelected = this.selectionLoan.selected.length;
        return numSelected === this.loanProfilesDTOS.length;
    }

    masterToggle(): void {
        if (this.isAllLoanSelected()) {
            this.selectionLoan.clear();
        } else {
            this.loanProfilesDTOS.forEach(row => this.selectionLoan.select(row));
        }
    }

    onExportLoan() {
        let columnDefinition = [
            new CheckboxColumn(),
            new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10),
            new TextColumn('loanTimeCycle', 'Kỳ hạn(ngày)', 15),
            new TextColumn('reasonsName', 'Mục đích huy động vốn', 15),
            new TextColumn('amount', 'Số tiền được yêu cầu (VNĐ)', 15, false, 3),
            new TextColumn('totalLoan', 'Số tiền được huy động (VNĐ)', 15, false, 3),
            new TextColumn('createdDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY - HH:mm:ss'),
            new TextColumn('statusName', 'Trạng thái', 10, false),
        ];
        this._excelService.exportExcel(columnDefinition,
            ['fsLoanProfilesId',
                'loanTimeCycle',
                'reasonsName',
                'amount',
                'totalLoan',
                'createdDate',
                'statusName'],
            this.selectionLoan.selected, 'ho_so_huy_dong', 'Hồ sơ huy động vốn');
    }
}
