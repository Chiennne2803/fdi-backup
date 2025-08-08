import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {APP_TEXT} from 'app/shared/constants';
import {AdmCategoriesDTO} from 'app/models/admin';
import {FuseConfirmationConfig, FuseConfirmationService} from '../../../../../@fuse/services/confirmation';
import {FsCardDownDTO} from "../../../../models/service";
import {DateTimeformatPipe} from "../../../../shared/components/pipe/date-time-format.pipe";
import {AuthService} from "../../../../core/auth/auth.service";

@Component({
    selector: 'confirm-debt',
    templateUrl: './confirm-debt.component.html',
    styleUrls: ['confirm-debt.component.css'],
    providers: [DateTimeformatPipe]
})
export class ConfirmDebtComponent implements OnInit {
    onSubmit = new EventEmitter();
    confirmDebtForm: UntypedFormGroup;
    appTextConfig = APP_TEXT;
    solutionId = new FormControl('');
    public selectedInvestors: AdmCategoriesDTO[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            payload: object;
            title: string;
            subTitle: string;
            valueDefault: number;
            problemSolution: AdmCategoriesDTO[];
            lstFsCardDown: FsCardDownDTO[];
            complete: () => void;
        },
        private _formBuilder: FormBuilder,
        private _confirmService: FuseConfirmationService,
        private _datetimePipe: DateTimeformatPipe,
        private _authService: AuthService,
    ) { }

    /**
     * On init
     */
    ngOnInit(): void {
        this.confirmDebtForm = this._formBuilder.group({
            finDocumentsId: new FormControl(''),
            solutionId: new FormControl('', [Validators.required]),
            processingContent: new FormControl('', [Validators.required, Validators.maxLength(500)]),
            fsCardDownIds: new FormControl('', [Validators.required]),
            isCloseLoanProfiles: new FormControl(false),
            createdByName: new FormControl({
                value: this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
    }

    public onSelectValue(valueIds: []): void {
        this.selectedInvestors = [...this.data.problemSolution.filter(value => {
            return valueIds.includes(value.admCategoriesId as never);
        })];
    }

    public setClosedProfile(value): void {
        if (value) {
            const config: FuseConfirmationConfig = {
                title: '',
                message: 'Hồ sơ sẽ được đóng và không thể hoàn tác, xác nhận thực hiện.',
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
                    this.confirmDebtForm.get('isCloseLoanProfiles').setValue(true);
                } else if (res === 'cancelled') {
                    this.confirmDebtForm.get('isCloseLoanProfiles').setValue(false);
                }
            });
        } else {
            this.confirmDebtForm.get('isCloseLoanProfiles').setValue(false);
        }
    }

    public submit(): void {
        this.confirmDebtForm.markAllAsTouched();
        if (this.confirmDebtForm.valid) {
            this.data.payload = {
                ...this.data.payload,
                ...this.confirmDebtForm.getRawValue(),
                solutionId: this.confirmDebtForm.get('solutionId').getRawValue() ? this.confirmDebtForm.get('solutionId').getRawValue().map(value => value).join(';') : '',
                isCloseLoanProfiles: this.confirmDebtForm.get('isCloseLoanProfiles').value ? 2 : 1,
                createdDate: null
            };
            this.onSubmit.emit(this.data.payload);
        }
    }

    public close(): void {
        this.data.complete();
    }
}
