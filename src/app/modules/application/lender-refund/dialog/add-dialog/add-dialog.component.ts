import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TranspayReqTransactionService} from '../../../../../service';
import {Observable} from 'rxjs';
import {FsCardDownDTO, FsLoanProfilesDTO, FsTranspayReqDTO} from '../../../../../models/service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APP_TEXT} from '../../../../../shared/constants';
import {MatSelectChange} from '@angular/material/select';
import {AuthService} from '../../../../../core/auth/auth.service';
import {User} from '../../../../../core/user/user.types';
import {isEmpty} from 'lodash';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogService} from '../../../../../service/common-service/dialog.service';
import {FuseAlertService} from "../../../../../../@fuse/components/alert";

@Component({
    selector: 'app-add-dialog',
    templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDialogComponent implements OnInit {
    loanProfileSelection$: Observable<FsLoanProfilesDTO[]>;
    lstCardDowns: FsCardDownDTO[];
    transpayPeriodDetail: FsTranspayReqDTO;
    formGroup: FormGroup;
    message = APP_TEXT;
    currentDate: Date = new Date();
    user: User;
    constructor(
        private dialogRef: MatDialogRef<AddDialogComponent>,
        private _transpayReqTransService: TranspayReqTransactionService,
        private _fb: FormBuilder,
        private _authService: AuthService,
        private _dialogService: DialogService,
        private _alertService: FuseAlertService,
    ) { }

    ngOnInit(): void {
        this.user = this._authService.authenticatedUser;
        this.loanProfileSelection$ = this._transpayReqTransService.loanProfiles$;
        this.formGroup = this._fb.group({
            fsLoanProfilesId: this._fb.control('', Validators.required),
            transCode: this._fb.control('', Validators.required),
            periodName: this._fb.control('', Validators.required),
        });
    }

    onChangeSelect(event: MatSelectChange, type: string): void {
        /*switch (type) {
            case 'loanProfile':
                this.transpayPeriodDetail = {};
                this.lstTranspayPeriod = [];
                this._transpayReqTransService.getCardDownByLoanProfile(event.value).subscribe(
                    res => this.lstCardDowns = res.payload.lstCardDowns
                );
                break;
            case 'cardDown':
                this._transpayReqTransService.getTranspayPeriodByCardDown(event.value).subscribe(
                    res => this.lstTranspayPeriod = res.payload.lstTranspayPeriod
                );
                break;
            case 'transpayPeriod':
                this._transpayReqTransService.initTranspayReqByTranspayPeriod(event.value).subscribe(
                    res => this.transpayPeriodDetail = res.payload
                );
                break;
            default:
        }*/
    }

    onSubmit(): void {
        this.formGroup.markAllAsTouched();
        if ( this.formGroup.valid ) {
            const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
            confirmDialog.afterClosed().subscribe((res) => {
                if ( res === 'confirmed' ) {
                    this._transpayReqTransService.transpayReqTransaction(this.transpayPeriodDetail).subscribe(
                        (res) => {
                            if ( res.errorCode === '0' ) {
                                this._alertService.showMessageSuccess('Xử lý thành công');
                                this._transpayReqTransService.prepare().subscribe();
                                this.dialogRef.close({ success: true });
                            } else {
                                this._alertService.showMessageError(res.message.toString());
                            }
                        }
                    );
                }
            });
        }
    }

    closeDialog(): void {
        if ( this.formGroup.get('fsLoanProfilesId').value ) {
            const confirmDialog = this._dialogService.openConfirmDialog('Dữ liệu đang thao tác trên màn hình sẽ bị mất, xác nhận thực hiện ?');

            confirmDialog.afterClosed().subscribe((res) => {
                if ( res === 'confirmed' ) {
                    this.dialogRef.close();
                }
            });
        }

        else {
            this.dialogRef.close();
        }
    }

    isInvalid(formControlName: string): boolean {
        return this.formGroup?.get(formControlName)?.hasError('required')
            && this.formGroup?.get(formControlName)?.touched;
    }

    isEmptyDetail(): boolean {
        return isEmpty(this.transpayPeriodDetail);
    }
}
