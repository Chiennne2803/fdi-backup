import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { DateTimeformatPipe } from '../../../../../../shared/components/pipe/date-time-format.pipe';
import { AdmAccountDetailDTO } from "../../../../../../models/admin";

@Component({
    selector: 'dialog-process-4',
    templateUrl: './dialog-process-4.component.html',
    providers: [DateTimeformatPipe]
})
export class DialogProcess4Component implements OnInit {
    onSubmit = new EventEmitter();
    formGroup: FormGroup;
    public isRq = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _datetimePipe: DateTimeformatPipe,
    ) { }

    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            status: new FormControl(null, Validators.required),
            content: new FormControl(null, Validators.required),
            financialStatement: new FormControl(null, Validators.required),
            createdByName: new FormControl({
                value: this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            finDocumentsId: new FormControl('', [Validators.required]),
        });
        this.formGroup.get('status').valueChanges.subscribe((value) => {
            if (value === 0 || value === 2) {
                this.isRq = false;
                this.formGroup.get('financialStatement')?.clearValidators();
                this.formGroup.get('finDocumentsId')?.clearValidators();
            } else {
                this.isRq = true;
                this.formGroup.get('financialStatement')?.setValidators(Validators.required);
                this.formGroup.get('finDocumentsId')?.setValidators(Validators.required);
            }

            // Cập nhật lại trạng thái validate
            this.formGroup.get('financialStatement')?.updateValueAndValidity();
            this.formGroup.get('finDocumentsId')?.updateValueAndValidity();

        });
    }

    onClickSubmit(): void {
        console.log(this.formGroup.value)
        this.formGroup.markAllAsTouched();
        if (this.formGroup.valid) {
            this.onSubmit.emit(this.formGroup.value);
        }
    }
}
