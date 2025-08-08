import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {APP_TEXT} from 'app/shared/constants';
import {AdmAccountDetailDTO, AdmCategoriesDTO} from 'app/models/admin';
import {FuseConfirmationService} from '../../../../../../@fuse/services/confirmation';
import {FsCardDownDTO} from "../../../../../models/service";

@Component({
    selector: 'sign-process',
    templateUrl: './sign-process.component.html',
    styleUrls: ['sign-process.component.css'],
})
export class SignProcessComponent implements OnInit {
    onSubmit = new EventEmitter();
    signProcessForm: UntypedFormGroup;
    appTextConfig = APP_TEXT;
    solutionId = new FormControl('');
    public isSubmit = false;
    public selectedInvestors: AdmCategoriesDTO[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            payload: object;
            lstAccountApproval: AdmAccountDetailDTO[];
            complete: () => void;
        },
        private _formBuilder: FormBuilder,
        private _confirmService: FuseConfirmationService,
    ) { }

    /**
     * On init
     */
    ngOnInit(): void {
        this.signProcessForm = this._formBuilder.group({
            assignTo: new FormControl('', [Validators.required]),
            assignComment: new FormControl('', [Validators.maxLength(200)]),
        });
    }

    public submit(): void {
        this.data.payload = {
            ...this.data.payload,
            assignTo: this.signProcessForm.get('assignTo').getRawValue(),
            assignComment: this.signProcessForm.get('assignComment').getRawValue(),
        };
        this.signProcessForm.markAllAsTouched();
        if (this.signProcessForm.valid) {
            this.onSubmit.emit(this.data.payload);
        }
    }

    public close(): void {
        this.data.complete();
    }
}
