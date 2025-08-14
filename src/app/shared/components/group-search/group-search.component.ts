import {Component, EventEmitter, Inject, OnInit, Output,} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import moment from 'moment';
import {validDateFormat} from "../../validator/date";
import {MAT_DATE_FORMATS} from "@angular/material/core";


export const MY_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
@Component({
    selector: 'app-group-search',
    templateUrl: './group-search.component.html',
    styleUrls: ['./group-search.component.scss'],
    providers: [
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})
export class GroupSearchComponent implements OnInit {
    @Output() public btnSearchClicked: EventEmitter<any> = new EventEmitter<any>(); //ActionSearchModel
    public searchGroup: FormGroup = new FormGroup({});
    distanceDate = 180;
    groupDate = {};

    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            baseData: object;
            searchConfig: any;
            complete: () => void;
        },
        private dialogRef: MatDialogRef<GroupSearchComponent>
    ) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit(): void {
        const group: any = {};

        this.data.searchConfig.config.map((el) => {
            const validators = [];
            if (el.type.includes('from-to')) {
                if (el.type.includes('date-from-to')) {
                    validators.push(validDateFormat());
                    if (el.distanceDate) {
                        this.distanceDate = el.distanceDate;
                    }
                }
                if (el.required) {
                    validators.push(Validators.required);
                }
                const dateFrom = `${el.id}From`;
                const dateTo = `${el.id}To`;
                this.groupDate[`${dateFrom}Min`] = null;
                this.groupDate[`${dateFrom}Max`] = null;
                this.groupDate[`${dateTo}Min`] = null;
                this.groupDate[`${dateTo}Max`] = null;
                group[dateFrom] = new FormControl(null, validators);
                group[dateTo] = new FormControl(null, validators);
            } else {
                if (el.required) {
                    validators.push(Validators.required);
                }
                group[el.id] = new FormControl(el.defaultValue, validators);
            }
        });
        this.searchGroup = new FormGroup(group);
        if (this.data.baseData) {
            this.searchGroup.patchValue(this.data.baseData);
        }
        /*console.log("OK")
        this.searchGroup.statusChanges.subscribe(status => {
            if (status === 'INVALID') {
                console.log("INVALID")
                for (const field in this.searchGroup.controls) {
                    const control = this.searchGroup.get(field);

                    // Kiểm tra trường hợp trường không hợp lệ
                    if (control.invalid) {
                        // Xử lý lỗi tại đây
                        console.log(`Trường ${field} không hợp lệ`);
                        console.log(control.errors);
                    }
                }
                // Xử lý khi form có trạng thái INVALID
            }
        });*/
    }

    public onSetMinMaxDateFromTo(formId: string, type: string, event): void {
        switch (type) {
            case 'valueFrom':
                this.groupDate[`${formId}Min`] = moment(event).format('YYYY-MM-DD');
                this.groupDate[`${formId}Max`] = moment(event).add(this.distanceDate, 'days').format('YYYY-MM-DD');
                break;
            case 'valueTo':
                this.groupDate[`${formId}Min`] = moment(event).subtract(this.distanceDate, 'days').format('YYYY-MM-DD');
                this.groupDate[`${formId}Max`] = moment(event).format('YYYY-MM-DD');
                break;
            default:
                break;
        }
    }

    public onBtnSearchClk(): void {
        this.searchGroup.markAllAsTouched();
        if (this.searchGroup.valid) {
            // console.log(this.searchGroup.value)
            this.btnSearchClicked.emit({action: 'search', form: this.searchGroup});
        }
    }


    public onBtnClearClk(): void {
        this.searchGroup.reset();
        // this.btnSearchClicked.emit({action: 'reset', form: this.searchGroup});
    }

    public close(): void {
        this.data.complete();
    }

    getErrorDate(id: string, reqMsg?: string) {
        if (this.searchGroup.get(id).touched) {
            if (this.searchGroup.get(id).hasError('invalidDateFormat')
                || this.searchGroup.get(id).hasError('matDatepickerParse')) {
                return "Lỗi định dạng";
            }
            if (this.searchGroup.get(id).hasError('required')) {
                return reqMsg;
            }
        }
    }

    isSearchGroupDirty(): boolean{
        if(window.location.pathname.includes('statistical-report/report-investor')||window.location.pathname.includes('application/commission-management/transaction')) {
            return false;
        }
        for (const field in this.searchGroup.controls) {
            if (this.searchGroup.controls[field].value) {
                return false;
            }
        }
        return true;
    }
}
