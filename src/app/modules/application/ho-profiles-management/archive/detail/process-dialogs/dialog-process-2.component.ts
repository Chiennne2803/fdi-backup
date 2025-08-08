import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../../../core/auth/auth.service';
import {DateTimeformatPipe} from '../../../../../../shared/components/pipe/date-time-format.pipe';
import {AdmAccountDetailDTO, UserType} from "../../../../../../models/admin";


@Component({
    selector: 'dialog-process-2',
    templateUrl: './dialog-process-2.component.html',
    providers: [DateTimeformatPipe]
})
export class DialogProcess2Component implements OnInit {
    onSubmit = new EventEmitter();
    formGroup: FormGroup;
    public isRq = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: AdmAccountDetailDTO,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _datetimePipe: DateTimeformatPipe,
    ) {}

    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            status: new FormControl(null, Validators.required),
            saleComment: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
            saleNote: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
            financialStatement: new FormControl(null, Validators.required),
            createdByName: new FormControl({
                value: this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
        if (this.data.type == UserType.INDIVIDUAL) {
            this.formGroup.removeControl('financialStatement');
        }
        this.formGroup.get('status').valueChanges.subscribe((value) => {
            if (value === 0) {
                this.isRq = false;
                this.formGroup.get('saleNote').removeValidators(Validators.required);
                this.formGroup.get('saleComment').removeValidators(Validators.required);
                this.formGroup.addControl('content', new FormControl(null, [Validators.required, Validators.maxLength(500)]));
                this.formGroup.removeControl('financialStatement');
                if (this.data.type == UserType.COMPANY) {
                    this.formGroup.addControl('financialStatement', new FormControl(null));
                }
            } else {
                this.isRq = true;
                this.formGroup.get('saleNote').addValidators(Validators.required);
                this.formGroup.get('saleComment').addValidators(Validators.required);
                this.formGroup.removeControl('content');
                this.formGroup.removeControl('financialStatement');
                if (this.data.type == UserType.COMPANY) {
                    this.formGroup.addControl('financialStatement', new FormControl(null, Validators.required));
                }
            }
        });
    }

    onClickSubmit(): void {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.valid) {
            this.onSubmit.emit(this.formGroup.value);
        }
    }
}
