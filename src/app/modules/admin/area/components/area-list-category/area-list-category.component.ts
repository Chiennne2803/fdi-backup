import {Component, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {AdmCategoriesDTO} from 'app/models/admin';
import {BaseResponse} from 'app/models/base';
import {ButtonTableEvent, ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {Observable} from 'rxjs';
import {TABLE_BUTTON_ACTION_CONFIG_CATEGORY, TASK_BAR_CATEGORY_CONFIG} from './area.config';
import {FuseAlertService} from "../../../../../../@fuse/components/alert";
import {ButtonConfig, CommonButtonConfig, SearchBar} from "../../../../../shared/models/datatable/task-bar.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AreaService} from "../../../../../service/admin/area.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AreaDialogComponent} from "../area-dialog/area-dialog.component";
import {CheckboxColumn, TextColumn} from "../../../../../shared/models/datatable/display-column.model";
import {FuseConfirmationService} from "../../../../../../@fuse/services/confirmation";


@Component({
    selector: 'area-list-category',
    templateUrl: './area-list-category.component.html',
    styleUrls: ['./area-list-category.component.scss']
})
export class AreaListCategoryComponent implements OnInit {

    public _tableCateogyConfig: ITableConfig = {
        columnDefinition: [],
        title: 'Danh sách danh mục',
        isViewDetail: false
    };
    public _taskBarConfig = TASK_BAR_CATEGORY_CONFIG;
    public _tableBtnConfig = TABLE_BUTTON_ACTION_CONFIG_CATEGORY;

    public _dataSource$: Observable<BaseResponse>;
    private searchPayload: any;
    private parentCategories: AdmCategoriesDTO = new AdmCategoriesDTO();
    private parentArea: AdmCategoriesDTO = new AdmCategoriesDTO();
    private parentCategoriesCode;

    /**
     * constructor
     * @param _areaService
     * @param _fuseAlertService
     */
    constructor(
        private _areaService: AreaService,
        private _fuseAlertService: FuseAlertService,
        private _confirmService: FuseConfirmationService,
        private _matDialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.parentCategories = undefined;
        this.parentArea = undefined;
        this._areaService.parentCategories$.subscribe((res) => this.parentCategories = res)

        this.route.params.subscribe(params => {
            this.parentCategoriesCode = params['parentCategoriesCode'];
            if (this.parentCategoriesCode) {
                this._areaService.getDetailByCode(this.parentCategoriesCode).subscribe(res => {
                    this.parentArea = res.payload;
                    if (this.router.url.endsWith('area/province')) {
                        this._tableCateogyConfig = this.createConfigDatatable('Danh sách Tỉnh/Thành phố', 'Tỉnh/Thành phố');
                        this._areaService.getParentCategories({admCategoriesId: 2000}).subscribe();
                    } else if (this.router.url.includes('area/province/')) {
                        this._tableCateogyConfig = this.createConfigDatatable(
                            'Danh sách quận/huyện thuộc ' + this.parentArea.categoriesName, 'Quận/Huyện');
                        this._taskBarConfig = {
                            searchBar: new SearchBar('Nhập để tìm kiếm', false),
                            otherBtn: [
                                new ButtonConfig('SFF_DIRECTORY_DATA_INSERT', true, false, 'Thêm Quận/Huyện', 'feather:plus-circle', 'add'),
                                new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
                            ]
                        };
                        this._areaService.getParentCategories({admCategoriesId: 2001}).subscribe();
                    } else if (this.router.url.includes('area/district/')) {
                        this._tableCateogyConfig = this.createConfigDatatable(
                            'Danh sách phường/xã thuộc ' + this.parentArea.categoriesName, 'Phường/Xã');
                        this._taskBarConfig = {
                            searchBar: new SearchBar('Nhập để tìm kiếm', false),
                            otherBtn: [
                                new ButtonConfig('SFF_DIRECTORY_DATA_INSERT', true, false, 'Thêm phường/xã', 'feather:plus-circle', 'add'),
                                new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
                            ]
                        };
                        this._areaService.getParentCategories({admCategoriesId: 2002}).subscribe();
                    }
                });

                this.searchPayload = {
                    ...this.searchPayload,
                    parentCategoriesCode: this.parentCategoriesCode
                }
                this.doSearch();
            } else {
                this._tableCateogyConfig = this.createConfigDatatable('Danh sách Tỉnh/Thành phố', 'Tỉnh/Thành phố');
                this._taskBarConfig = {
                    searchBar: new SearchBar('Nhập để tìm kiếm', false),
                    otherBtn: [
                        new ButtonConfig('SFF_DIRECTORY_DATA_INSERT', true, false, 'Thêm Tỉnh/Thành phố', 'feather:plus-circle', 'add'),
                        new ButtonConfig('', false, true, '', 'heroicons_outline:cog')
                    ]
                };
                this._areaService.doSearchProvince().subscribe();
                this._areaService.getParentCategories({admCategoriesId: 2000}).subscribe();
            }
        });
    }

    doSearch() {
        if (this.router.url.endsWith('area/province')) {
            this._areaService.doSearchProvince(this.searchPayload).subscribe();
        } else if (this.router.url.includes('area/province/')) {
            this._areaService.doSearchDistrict(this.searchPayload).subscribe();
        } else if (this.router.url.includes('area/district/')) {
            this._areaService.doSearchCommune(this.searchPayload).subscribe();
        }
    }

    ngOnInit(): void {
        this._dataSource$ = this._areaService.lazyLoad;
    }

    public handleRowClick(row: any): void {
        this._tableCateogyConfig.isViewDetail = false;
        this.openDialogUpdate(row);
    }

    public handleCloseDetailPanel($event: Event): void {
        this._tableCateogyConfig.isViewDetail = false;
    }

    handleTableEvent(event: ButtonTableEvent): void {
        if (this.parentCategories) {
            const dialogConfig = new MatDialogConfig();
            switch (event.action) {
                case 'add':
                    dialogConfig.autoFocus = true;
                    dialogConfig.disableClose = true;
                    dialogConfig.width = '65%';
                    dialogConfig.data = {
                        parentId: this.parentCategories.admCategoriesId,
                        parentCategoriesCode: this.parentArea ? this.parentArea.categoriesCode : '',
                        parentCategoriesName: this.parentCategories.categoriesName,
                        nameParent : this.parentArea ? this.parentArea.categoriesName : '',
                        categoriesCode: "tmp",
                    };
                    const dialog = this._matDialog.open(AreaDialogComponent, dialogConfig);
                    dialog.afterClosed().subscribe((res) => {
                        this.doSearch();
                    });
                    break;
                case 'edit':
                    if (event.rowItem) {
                        this.openDialogUpdate((event.rowItem as AdmCategoriesDTO))
                    }
                    break;
                case 'lock':
                case 'unlock':
                    // this.handleListChange.emit(new ButtonAction(event.action, (event.rowItem as AdmCategoriesDTO[])));
                    break;
                case 'deleted':
                    const dialogRef = this._confirmService.open({
                        title: 'Xác nhận Xoá địa bàn?',
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
                            const requestLock = (event.rowItem as AdmCategoriesDTO[]).map(x => x.admCategoriesId);
                            this._areaService.lockAll({
                                ids: requestLock
                            }).subscribe((res) => {
                                if (res.errorCode === '0') {
                                    this._fuseAlertService.showMessageSuccess('Xoá địa bàn thành công');
                                    this.doSearch();
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
        } else {
            this._fuseAlertService.showMessageWarning("Chưa chọn danh mục")
        }
    }

    /**
     * openDialogUpdate
     * @param admCategoriesDTO
     */
    openDialogUpdate(admCategoriesDTO: AdmCategoriesDTO): void {
        this._areaService.getDetail({admCategoriesId: admCategoriesDTO.admCategoriesId}).subscribe((res) => {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.width = '65%';
            dialogConfig.data = {
                ...res.payload,
                parentCategoriesName: this.parentCategories.categoriesName,
                nameParent : this.parentArea ? this.parentArea.categoriesName : '',
            };
            const dialog = this._matDialog.open(AreaDialogComponent, dialogConfig);
            dialog.afterClosed().subscribe((res) => {
                this.doSearch();
            });
        });
    }

    checkboxItemChange(rows): void {
        const onlyActive = rows.filter(item => (item.status !== 1)).length == 0;
        const onlyDeActive = rows.filter(item => item.status !== 0).length == 0;

        let lstCommonBtn: CommonButtonConfig[] = [];
        if (onlyActive) {
            lstCommonBtn.push({type: 'edit', role: 'SFF_DIRECTORY_DATA_UPDATE'});
            lstCommonBtn.push({type: 'deleted', role: 'SFF_DIRECTORY_DATA_DELETE'});
        }
        if (onlyDeActive) {
            //khong cho unlock
            // lstCommonBtn.push({type: 'unlock', role: 'SFF_DIRECTORY_DATA_UPDATE'});
        }
        this._tableBtnConfig = {
            commonBtn: [
                {type: 'export', role: 'SFF_DIRECTORY_DATA_EXPORT', fileName : 'Quan_ly_dia_ban'},
                ...lstCommonBtn,
            ]
        };
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: event.pageIndex,
            limit: event.pageSize,
        };
        this.doSearch();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this.doSearch();
    }

    createConfigDatatable(title, headerName): ITableConfig {
        return {
            columnDefinition: [
                new CheckboxColumn(),
                new TextColumn('categoriesCode', 'Mã ' + headerName, 20, true),
                new TextColumn('categoriesName', 'Tên ' + headerName, 20),
                new TextColumn('value', 'Giá trị', 15),
                new TextColumn('statusName', 'Trạng thái', 15),
                new TextColumn('createdByName', 'Người tạo', 15),
                new TextColumn('lastUpdatedDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY'),
            ],
            title: title,
            isViewDetail: false
        }
    }

    createConfigTaskBar(title, headerName): ITableConfig {
        return {
            columnDefinition: [
                new CheckboxColumn(),
                new TextColumn('categoriesCode', 'Mã ' + headerName, 20, true),
                new TextColumn('categoriesName', 'Tên ' + headerName, 20),
                new TextColumn('value', 'Giá trị', 15),
                new TextColumn('statusName', 'Trạng thái', 15),
                new TextColumn('createdByName', 'Người tạo', 15),
                new TextColumn('lastUpdatedDate', 'Ngày tạo', 10, false, 'DD/MM/YYYY'),
            ],
            title: title,
            isViewDetail: false
        }
    }
}
