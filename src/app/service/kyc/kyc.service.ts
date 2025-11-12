import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {BaseResponse} from 'app/models/base';
import {KycPrepareLoadingPage, PayloadPrepareLoadingPage} from 'app/shared/components/kyc/kyc-details/kyc.types';
import {BehaviorSubject, catchError, Observable, of, tap} from 'rxjs';
import {DeputyType} from '../../enum';
import {BaseService} from '../base-service';
import {FormsPrepareLoadingPage} from './../../shared/components/kyc/kyc-details/kyc.types';
import {FuseAlertService} from "../../../@fuse/components/alert";
import FileSaver from 'file-saver';
import {FileService} from "../common-service";

@Injectable({
    providedIn: 'root'
})
export class KycServices extends BaseService {
    private _kycPayload$: BehaviorSubject<PayloadPrepareLoadingPage[]> = new BehaviorSubject<PayloadPrepareLoadingPage[]>([]);

    constructor(
        private _httpClient: HttpClient,
        private _fb: FormBuilder, _fuseAlertService: FuseAlertService,
        private _fileService: FileService,
    ) {
        super(_httpClient, _fuseAlertService, '', 'kyc');
    }

    /**
     * Getter for kyc payload
     */
    get kycPayLoad(): Observable<PayloadPrepareLoadingPage[]> {
        return this._kycPayload$.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    loadingPrepareKycPage(): Observable<KycPrepareLoadingPage> {
        return this.prepareLoadingPage().pipe(
            catchError(err => of(err)),
            tap((res: KycPrepareLoadingPage) => {
                if (res.payload) {
                    this._kycPayload$.next(res.payload);
                }
            })
        );
    }

    createDynamicForm(prepareForm: PayloadPrepareLoadingPage[], formArray: FormArray): void {
        // Clear form before create
        formArray.clear();

        prepareForm.forEach((data, index) => {
            // Init object
            const columnObj = {};
            const tableNameObj = {};
            const payload = this._fb.group({});
            const isEnd = index === prepareForm.length - 1;

            data.forms.forEach((form) => {
                // Split name of form to get formcontrolname and formgroupname
                const name = form.name.split('.');
                data.formGroupName = name[0];
                form.formControlName = name[1];
                // set max date for DatePicker type
                this.transformDatePickerData(data, form, form.formControlName);
                const isFileType = form.type === 'File' || form.type === 'Avata';


                if ( isFileType ) {
                    // Dynamic form for file type, it's no need pattern in form
                    const sharedFormControlName = data.forms.filter(f => {
                        if (f.name ===  form.name) return true;
                        return false;
                    });
                    if ( sharedFormControlName.length > 1 ) {
                        form.formControlName = `group_${name[1]}_temp_${form.position}`;
                    }
                    if (form.require) {
                        columnObj[form.formControlName] = this._fb.control(null, Validators.required);
                    } else {
                        columnObj[form.formControlName] = this._fb.control(null);
                    }
                } else {
                    // Dynamic form for other type
                    if (form.require) {
                        columnObj[name[1]] = this._fb.control(null, Validators.required);
                    }

                    if (form.pattern) {
                        columnObj[name[1]] = this._fb.control(null, Validators.pattern(form.pattern));
                    }

                    if (form.require && form.pattern) {
                        columnObj[name[1]] = this._fb.control(null, [
                            Validators.pattern(form.pattern), Validators.required
                        ]);
                    }
                    if (!form.require && !form.pattern) {
                        columnObj[name[1]] = this._fb.control(null);
                    }
                    if(form.name == 'admAccountDetailDTO.email') {
                        columnObj[name[1]].setValue(form.defaultValue)
                        columnObj[name[1]].disable();
                    }
                }
            });
            // Set is end for payload
            data.isEnd = isEnd;
            // Assign table formGroup
            tableNameObj[data.formGroupName] = this._fb.group(columnObj);
            //Assign payload formGroup
            payload.addControl('payload', this._fb.group({
                ...tableNameObj,
                kycStep: this._fb.control(data.kycStep),
                isEnd: this._fb.control(isEnd),
                deputyType: this._fb.control(data.deputyType),
                isPosted: false
            }));
            formArray.push(payload);
        });
    }

    transformDatePickerData(payload: PayloadPrepareLoadingPage, form: FormsPrepareLoadingPage, formControlName: string): void {
        if ( form.type === 'Datepicker' ) {
            switch(formControlName) {
                case 'dateOfBirth':
                        form.maxDate = { 'days': -1 };
                        form.dateValidation = ['upper18'];
                    break;
                default:
                    form.maxDate = { 'days': 0 };
                    form.dateValidation = ['today'];
                    break;
            }
        }
    }

    postDataKyc(data: any): Observable<BaseResponse> {
        return this.doCreate(data).pipe(
            catchError(err => of(err))
        );
    }

    downloadTemplate(type: string): void {
        this.doPost(type, null).subscribe((res) => {
            FileSaver.saveAs(this._fileService.dataURItoBlob(res.payload.contentBase64), res.payload.docName);
        });
    }

    sendEmail(): Observable<BaseResponse> {
        return this.doGet('sendMailOTP');
    }

    contactCustomerCare(): Observable<BaseResponse> {
        return this.doPost('contactCustomerCare', {});
    }
}
