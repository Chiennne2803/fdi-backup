import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {AdmCategoriesDTO, ButtonAction} from 'app/models/admin';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {CategoriesService} from 'app/service';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {Observable} from 'rxjs';
import {TABLE_BUTTON_ACTION_CONFIG_CATEGORY, TABLE_CATEGORY_CONFIG, TASK_BAR_CATEGORY_CONFIG} from './item.config';
import {FuseAlertService} from "../../../../../../@fuse/components/alert";
import {CommonButtonConfig} from "../../../../../shared/models/datatable/task-bar.model";


@Component({
    selector: 'app-item-list-category',
    templateUrl: './item-list-category.component.html',
    styleUrls: ['./item-list-category.component.scss']
})
export class ItemListCategoryComponent implements OnChanges {
    @Input() parentId: number = 0;
    @Output() handleListChange: EventEmitter<ButtonAction> = new EventEmitter<ButtonAction>();

    public _tableCateogyConfig = TABLE_CATEGORY_CONFIG;
    public _taskBarConfig = TASK_BAR_CATEGORY_CONFIG;
    public _tableBtnConfig = TABLE_BUTTON_ACTION_CONFIG_CATEGORY;
    public _dataSource$: Observable<BaseResponse>;
    private searchPayload: BaseRequest = new BaseRequest();
    private requestCategory: AdmCategoriesDTO = new AdmCategoriesDTO();

    /**
     * constructor
     * @param _categoriesService
     * @param _fuseAlertService
     */
    constructor(
        private _categoriesService: CategoriesService,
        private _fuseAlertService: FuseAlertService,
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.parentId.currentValue !== 0) {
            this.requestCategory.parentId = changes.parentId.currentValue;
            this._categoriesService.getDetail({admCategoriesId: this.requestCategory.parentId}).subscribe((res) => {
                let parentObj = res.payload;
                this._tableCateogyConfig = TABLE_CATEGORY_CONFIG;
                this._tableCateogyConfig.columnDefinition[1].name = "Mã " + parentObj.categoriesName;
                this._tableCateogyConfig.columnDefinition[2].name = "Tên " + parentObj.categoriesName;
                this._tableCateogyConfig.title = "Danh sách " + parentObj.categoriesName;
                this._categoriesService.doSearch(this.requestCategory).subscribe();
                this._dataSource$ = this._categoriesService.lazyLoad;
            });
        }
    }

    public handleRowClick(row: any): void {
        this._tableCateogyConfig.isViewDetail = false;
        this.handleListChange.emit(new ButtonAction('edit', row));
    }

    public handleCloseDetailPanel($event: Event): void {
        this._tableCateogyConfig.isViewDetail = false;

    }

    handleTableEvent(event: ButtonTableEvent): void {
        if (this.requestCategory && this.requestCategory.parentId) {
            switch (event.action) {
                case 'add':
                    this.handleListChange.emit(new ButtonAction('new'));
                    break;
                case 'edit':
                    this.handleListChange.emit(new ButtonAction(event.action, (event.rowItem as AdmCategoriesDTO)));
                    break;
                case 'lock':
                case 'unlock':
                    this.handleListChange.emit(new ButtonAction(event.action, (event.rowItem as AdmCategoriesDTO[])));
                    break;
                case 'deleted':
                    this.handleListChange.emit(new ButtonAction(event.action, (event.rowItem as AdmCategoriesDTO[])));
                    break;
                default:
                    break;
            }
        } else {
            this._fuseAlertService.showMessageWarning("Chưa chọn danh mục")
        }
    }

    checkboxItemChange(rows): void {
        const onlyActive = rows.filter(item => (item.status !== 1)).length == 0;
        const onlyDeActive = rows.filter(item => item.status !== 0).length == 0;

        let lstCommonBtn: CommonButtonConfig[] = [];
        if(onlyActive) {
            lstCommonBtn.push( {type: 'deleted', role: 'SFF_DIRECTORY_DATA_DELETE'});
        }
        if(onlyDeActive) {
            //khong cho unlock
            // lstCommonBtn.push({type: 'unlock', role: 'SFF_DIRECTORY_DATA_UPDATE'});
        }

        //status =0 hoac 1 deu co edit
        lstCommonBtn.push( {type : 'edit', role : 'SFF_DIRECTORY_DATA_UPDATE'});
        this._tableBtnConfig = {
            commonBtn: [
                {type: 'export', role: 'SFF_DIRECTORY_DATA_EXPORT', fileName : 'Danh_muc_du_lieu'},
                ...lstCommonBtn,
            ]
        };

    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this.requestCategory,
            page: event.pageIndex,
            limit: event.pageSize,
        };
        this._categoriesService.doSearch(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            ...this.requestCategory,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._categoriesService.doSearch(this.searchPayload).subscribe();
    }
}
