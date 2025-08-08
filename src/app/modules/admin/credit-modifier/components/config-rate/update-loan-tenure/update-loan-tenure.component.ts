import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { ConfRateService } from 'app/service';
import { APP_TEXT } from 'app/shared/constants';
import {FsConfRateDTO} from "../../../../../../models/service/FsConfRateDTO.model";

@Component({
    selector: 'app-update-loan-tenure',
    templateUrl: './update-loan-tenure.component.html',
    styleUrls: ['./update-loan-tenure.component.scss']
})
export class UpdateLoanTenureComponent implements OnInit {
    public creditRateAdd: number = 0;

    constructor(
        private matDialogRef: MatDialogRef<UpdateLoanTenureComponent>,
        private _configRate:  ConfRateService,
        private _fuseAlertService: FuseAlertService,
        private _confirmService: FuseConfirmationService
    ) { }

    ngOnInit(): void {
        this._configRate._confCreditDetail.subscribe((res) => {
            if (res) {
                this.creditRateAdd = res.creditRateAdd;
            }
        });
    }

    back(): void {
        const config: FuseConfirmationConfig = {
            title: '',
            message: 'Dữ liệu thao tác trên màn hình sẽ bị mất, xác nhận thực hiện',
            actions: {
                confirm: {
                    label: 'Đồng ý',
                    color: 'primary'
                },
                cancel: {
                    label: 'Huỷ'
                }
            }
        };
        const dialog = this._confirmService.open(config);
        dialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.matDialogRef.close(false);
            }
        });
    }
    submit(): void {
        if (this.creditRateAdd == null || this.creditRateAdd == undefined || this.creditRateAdd <= 0) {

        } else {
            const config: FuseConfirmationConfig = {
                title: 'Xác nhận lưu dữ liệu',
                message: '',
                actions: {
                    confirm: {
                        label: 'Lưu',
                        color: 'primary'
                    },
                    cancel: {
                        label: 'Huỷ'
                    }
                }
            };
            const dialog = this._confirmService.open(config);
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    const payload = new FsConfRateDTO();
                    payload.creditRateAdd = this.creditRateAdd;
                    this._configRate.updateCreditRate(payload).subscribe((response) => {
                        if (response.errorCode === '0') {
                            this.matDialogRef.close(true);
                        } else {
                            this._fuseAlertService.showMessageError(response.message.toString());
                        }
                    });
                    this.matDialogRef.close(true);
                }
            });
        }
    }

}
