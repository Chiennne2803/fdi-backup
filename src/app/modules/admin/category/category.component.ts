import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSelectionListChange} from '@angular/material/list';
import {AdmCategoriesDTO, ButtonAction} from 'app/models/admin';
import {CategoriesService} from 'app/service';
import {CategoryDialogComponent} from './components/category-dialog/category-dialog.component';
import {ParentCategoryDialogComponent} from './components/parent-category-dialog/parent-category-dialog.component';
import {FuseAlertService} from "../../../../@fuse/components/alert";
import {FuseConfirmationService} from "../../../../@fuse/services/confirmation";

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    public parentCategories = new Array<AdmCategoriesDTO>();
    public parentId: number = 0;
    public parentObj: AdmCategoriesDTO;
    public isShowDetail = false;

    private dataDialog: AdmCategoriesDTO = new AdmCategoriesDTO();

    constructor(
        private _categoriesService: CategoriesService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _confirmService: FuseConfirmationService,
    ) { }

    ngOnInit(): void {
        this._categoriesService.parentCategories$.subscribe((res) => {
            if(res) {
                this.parentCategories = res;
            }
        });
    }

    public updateParentCategories(id?: number): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '65%';
        dialogConfig.data = null;
        if (id) {
            dialogConfig.data = this.parentCategories.filter(x => x.admCategoriesId === id)[0];
        }
        const dialog = this._matDialog.open(ParentCategoryDialogComponent, dialogConfig);
        dialog.afterClosed().subscribe((res) => {
            if (res) {
                this._categoriesService.parentAll().subscribe();
            }
        });
    }
    public onSelectionParentCategory(event: MatSelectionListChange): void {
        this.parentId = event.options.at(0).value;
        this.parentObj = this.parentCategories.filter(x => x.admCategoriesId === this.parentId)[0];
        if (this.parentObj.categoriesCode === 'DISTRICT') {
            this._categoriesService.getAllProvince().subscribe();
        }
        if (this.parentObj.categoriesCode === 'COMMUNE') {
            this._categoriesService.getAllDistrict().subscribe();
        }
    }

    public handleListChanged(event: ButtonAction): void {
        switch (event.action) {
            case 'new':
                if (this.parentId === 0) {
                    return;
                }
                const dialogConfig = new MatDialogConfig();
                dialogConfig.autoFocus = true;
                dialogConfig.disableClose = true;
                dialogConfig.width = '65%';
                dialogConfig.data = {
                    parentId: this.parentId,
                    parentCategoriesCode: this.parentObj.categoriesCode,
                    parentCategoriesName: this.parentObj.categoriesName,
                    categoriesCode: "tmp",
                };
                const dialog = this._matDialog.open(CategoryDialogComponent, dialogConfig);
                dialog.afterClosed().subscribe((res) => {

                });
                break
            case 'edit':
                if (event.dataItem && event.dataItem.admCategoriesId > 0) {
                    this._categoriesService.getDetail({admCategoriesId: event.dataItem.admCategoriesId}).subscribe((res) => {
                        const dialogConfig = new MatDialogConfig();
                        dialogConfig.autoFocus = true;
                        dialogConfig.disableClose = true;
                        dialogConfig.width = '65%';
                        dialogConfig.data = {
                            ...res.payload,
                            parentCategoriesCode: this.parentObj.categoriesCode,
                            parentCategoriesName: this.parentObj.categoriesName,
                        };
                        const dialog = this._matDialog.open(CategoryDialogComponent, dialogConfig);
                        dialog.afterClosed().subscribe((res) => {

                        });
                    });
                }
                break;
            case 'deleted':
                const dialogRef = this._confirmService.open({
                    title: 'Xác nhận Xoá danh mục?',
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
                        const requestLock = (event.dataItem as AdmCategoriesDTO[]).map(x => x.admCategoriesId);
                        this._categoriesService.lockAll({
                            ids: requestLock
                        }).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Xóa dữ liệu danh mục thành công');
                                if (this.parentId > 0) {
                                    this._categoriesService.doSearch({
                                        parentId: this.parentId,
                                    }).subscribe();
                                }
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                            }
                        });
                    }
                });
                break;
            case 'unlock':
                const dialogRef2 = this._confirmService.open({
                    title: 'Xác nhận mở khoá danh mục?',
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
                        const requestUnlock = (event.dataItem as AdmCategoriesDTO[]).map(x => x.admCategoriesId);
                        this._categoriesService.unlockAll({
                            ids: requestUnlock
                        }).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Mở khóa danh mục thành công');
                                if (this.parentId > 0) {
                                    this._categoriesService.doSearch({
                                        parentId: this.parentId,
                                    }).subscribe();
                                }
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
}
