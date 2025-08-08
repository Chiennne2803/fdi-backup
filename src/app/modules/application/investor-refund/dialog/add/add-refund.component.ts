import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranspayInvestorTransactionService} from '../../../../../service';
import {DialogService} from '../../../../../service/common-service/dialog.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {APP_TEXT} from '../../../../../shared/constants';
import {FsCardDownDTO, FsLoanProfilesDTO, FsTranspayInvestorDTO} from '../../../../../models/service';
import {MatSelectChange} from '@angular/material/select';
import {FsCardDownInvestorDTO} from '../../../../../models/service/FsCardDownInvestorDTO.model';
import {User} from '../../../../../core/user/user.types';
import {AuthService} from '../../../../../core/auth/auth.service';
import {FuseAlertService} from "../../../../../../@fuse/components/alert";

@Component({
    selector: 'app-document-sign-dialog',
    templateUrl: './add-refund.component.html',
    styleUrls: ['./add-refund.component.scss']
})
export class AddRefundInvestorComponent implements OnInit {
    formGroup: FormGroup;
    loanProfiles$: Observable<FsLoanProfilesDTO[]>;
    lstCardDownsInvestor: FsCardDownInvestorDTO[];
    lstCardDowns: FsCardDownDTO[];
    message = APP_TEXT;
    currentDate: Date = new Date();
    user: User;
    dataTable$: BehaviorSubject<FsCardDownInvestorDTO[]> = new BehaviorSubject<FsCardDownInvestorDTO[]>([]);
    dataPushToTable: FsCardDownInvestorDTO[];
    displayedColumns = ['no', 'createdByName', 'amountCapital', 'interest', 'perTax', 'fee', 'amount', 'createdDate'];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            fsTranspayInvestorId: number;
        },
        private dialogRef: MatDialogRef<AddRefundInvestorComponent>,
        private _transpayInvestorService: TranspayInvestorTransactionService,
        private _fb: FormBuilder,
        private _dialogService: DialogService,
        private _authService: AuthService,
        private _alertService: FuseAlertService
    ) {
        this.dialogRef.disableClose = true;
    }

    get transCodeControl(): FormControl {
        return this.formGroup.get('transCode') as FormControl;
    }

    get fsCardDownIdControl(): FormControl {
        return this.formGroup.get('fsCardDownId') as FormControl;
    }

    ngOnInit(): void {
        this.loanProfiles$ = this._transpayInvestorService.loanProfiles$;
        this.user = this._authService.authenticatedUser;
        this.initForm();
    }

    initForm(): void {
        this.formGroup = this._fb.group({
            fsLoanProfilesId: this._fb.control('', Validators.required),
            transCode: this._fb.control('', Validators.required),
            fsCardDownId: this._fb.control('', Validators.required),
            transComment: ''
        });
    }

    onChangeSelect(event: MatSelectChange, type: string): void {
     /*   this.currentDate = new Date();
        switch (type) {
            case 'loanProfile':
                this.lstCardDownsInvestor = [];
                this.transCodeControl.patchValue('');
                this.fsCardDownIdControl.patchValue('');
                this._transpayInvestorService.getCardDownByLoanProfile(event.value).subscribe(
                    res => this.lstCardDowns = res.payload.lstCardDowns
                );
                break;
            case 'cardDown':
                const cardDown = event.value as FsCardDownDTO;
                this.transCodeControl.patchValue(cardDown.transCode);
                this.fsCardDownIdControl.patchValue('');
                this._transpayInvestorService.getCardDownInvestorByCardDown(cardDown.fsCardDownId).subscribe(
                    res => this.lstCardDownsInvestor = res.payload?.lstCardDownInvestor
                );
                break;
            case 'cardDownInvestor':
                const values = event.value as FsCardDownInvestorDTO[];
                const id = values[0]?.fsCardDownId;
                this.fsCardDownIdControl.patchValue(id);
                this.dataTable$.next(values);
                break;
            default:
        }
        this.formGroup.updateValueAndValidity();*/
    }

    onSubmit(): void {
        this.formGroup.markAllAsTouched();
        if ( !this.formGroup.invalid && this.dataTable$.getValue().length > 0 ) {
            const payload = {
                ...this.formGroup.value,
                transpayInvestors: [...this.dataTable$.getValue()]
            };
            this._transpayInvestorService.transpayInvestorTransaction(payload).subscribe((res) => {
                if ( res.errorCode === '0' ) {
                    this._alertService.showMessageSuccess('Xử lý thành công');
                    this._transpayInvestorService.prepare().subscribe();
                    this.dialogRef.close({ success: true });
                } else {
                    this._alertService.showMessageError(res.message.toString());
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

    getTotal(): number {
        return this.dataTable$.getValue().map(t => t.amount)
            .reduce((acc, val) => acc + val, 0);
    }

    isInvalid(formControlName: string): boolean {
        return this.formGroup?.get(formControlName)?.hasError('required')
            && this.formGroup?.get(formControlName)?.touched;
    }
}
