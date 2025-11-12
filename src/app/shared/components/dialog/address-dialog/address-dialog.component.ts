import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, startWith, Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { APP_TEXT } from '../../../constants';
import { IBaseDataSourceObj } from '../../../models/base.model';
import { AddressService } from '../../../../service/common-service/address.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
    selector: 'address-dialog',
    templateUrl: './address-dialog.component.html',
    styleUrls: ['./address-dialog.component.scss']
})
export class AddressKycDialogComponent implements OnInit, OnDestroy {
    selectedTab = 0;

    formGroupNew!: FormGroup;
    subscription: Subscription = new Subscription();
    formGroup: FormGroup;

    provinces: IBaseDataSourceObj[] = [];
    districts: IBaseDataSourceObj[] = [];
    communes: IBaseDataSourceObj[] = [];

    message = APP_TEXT;
    alreadyAddress: string[] = [];

    filteredProvinces: IBaseDataSourceObj[] = [];
    filteredDistricts: IBaseDataSourceObj[] = [];
    filteredCommunes: IBaseDataSourceObj[] = [];

    constructor(
        public dialogRef: MatDialogRef<AddressKycDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _addressService: AddressService,
        private _fb: FormBuilder,
    ) { }

    get provinceFormControl(): FormControl {
        return this.formGroup.get('province') as FormControl;
    }

    get districtFormControl(): FormControl {
        return this.formGroup.get('district') as FormControl;
    }

    get communeFormControl(): FormControl {
        return this.formGroup.get('commune') as FormControl;
    }

    get streetAddressFormControl(): FormControl {
        return this.formGroup.get('street') as FormControl;
    }
    ngOnInit(): void {
        this.initAreaForm();

        if (this.data) {
            if (this.data.type === 'new') {
                // Mở tab nhập tay
                this.selectedTab = 1;
                this.formGroupNew.patchValue({
                    newAddress: this.data.value || ''
                });
            } else {
                this.selectedTab = 0;
                const parts = this.data.value?.split(', ') || [];

                // Tách 3 phần cuối
                const province = parts.at(-1);
                const district = parts.at(-2);
                const commune = parts.at(-3);

                // Phần còn lại là street (ghép lại bằng ", ")
                const street = parts.slice(0, -3).join(', ');

                // Gán lại mảng cho logic cũ nếu bạn cần
                this.alreadyAddress = [street, commune, district, province];

                this.loadProvince();
                this.streetAddressFormControl.patchValue(street);
            }
        }
    }

    onTabChange(event: MatTabChangeEvent): void {
        this.selectedTab = event.index;
        // console.log(event.index, this.selectedTab)
        if (this.selectedTab === 0) {
            this.loadProvince();
        }
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initAreaForm(): void {
        this.formGroup = this._fb.group({
            province: this._fb.control('', Validators.required),
            district: this._fb.control('', Validators.required),
            commune: this._fb.control(''),
            street: this._fb.control('', Validators.required),
        });
        this.formGroupNew = this._fb.group({
            newAddress: ['', Validators.required],
        });
    }

    resetForm(): void {
        this.districts = [];
        this.communes = [];
        this.formGroup.reset();
    }

    onChangeProvince(): void {
        this.communes = [];
        this.communeFormControl.patchValue(null);
        this.streetAddressFormControl.reset();
        this.loadDistrict();
    }


    // ======== Display function ========
    displayFn(item: IBaseDataSourceObj): string {
        return item && item.categoriesName ? item.categoriesName : '';
    }

    // ======== Province ========
    loadProvince(): void {
        this.subscription.add(
            this._addressService.getProvince().subscribe((res) => {
                this.provinces = res?.payload || [];
                if (!Array.isArray(this.provinces)) this.provinces = [];

                if (Array.isArray(this.alreadyAddress) && this.alreadyAddress.length > 0) {
                    const alreadyProvince = this.provinces.find(
                        (p) => p.categoriesName === this.alreadyAddress[this.alreadyAddress.length - 1]
                    );
                    if (alreadyProvince) {
                        this.provinceFormControl.patchValue(alreadyProvince);
                    }
                }

                this.provinceFormControl.valueChanges
                    .pipe(
                        startWith(''),
                        map((value) => (typeof value === 'string' ? value : value?.categoriesName)),
                        map((name) => (name ? this._filter(name, this.provinces) : this.provinces.slice()))
                    )
                    .subscribe((list) => (this.filteredProvinces = list));

                this.loadDistrict();
            })
        );
    }


    onProvinceBlur(): void {
        const value = this.provinceFormControl.value;

        if (typeof value === 'string') {
            const matched = this.provinces.find((p) => p.categoriesName === value);

            if (!matched) {
                setTimeout(() => {
                    const stillValue = this.provinceFormControl.value;
                    if (typeof stillValue === 'string' && stillValue === value) {
                        this.provinceFormControl.setValue(null);
                    }
                }, 200);
            } else {
                this.provinceFormControl.setValue(matched);
            }
        }
    }


    // ======== District ========
    loadDistrict(): void {
        // Kiểm tra provinceFormControl có giá trị hợp lệ không
        const provinceValue = this.provinceFormControl?.value;
        if (!provinceValue || !provinceValue.categoriesCode) {
            this.districts = [];
            this.filteredDistricts = [];
            return;
        }

        this.subscription.add(
            this._addressService.getDistrict(provinceValue.categoriesCode).subscribe((res) => {
                this.districts = Array.isArray(res?.payload) ? res.payload : [];

                // Xử lý district đã có sẵn nếu có
                if (Array.isArray(this.alreadyAddress) && this.alreadyAddress.length >= 2) {
                    const districtName = this.alreadyAddress[this.alreadyAddress.length - 2];
                    const alreadyDistrict = this.districts.find(
                        (d) => d.categoriesName === districtName
                    );
                    if (alreadyDistrict) {
                        this.districtFormControl.patchValue(alreadyDistrict);
                    }
                }

                // Lọc autocomplete
                this.districtFormControl.valueChanges
                    .pipe(
                        startWith(''),
                        map((value) => (typeof value === 'string' ? value : value?.categoriesName)),
                        map((name) =>
                            name
                                ? this._filter(name, this.districts)
                                : this.districts.slice()
                        )
                    )
                    .subscribe((list) => (this.filteredDistricts = list));

                // Load tiếp commune nếu có sẵn district
                this.loadCommune();
            })
        );
    }

    onDistrictBlur(): void {
        const value = this.districtFormControl.value;

        if (typeof value === 'string') {
            const matched = this.districts.find((d) => d.categoriesName === value);

            if (!matched) {
                // Delay một chút để autocomplete không bị nháy
                setTimeout(() => {
                    const stillValue = this.districtFormControl.value;
                    if (typeof stillValue === 'string' && stillValue === value) {
                        this.districtFormControl.setValue(null);
                    }
                }, 200); // bạn có thể tăng lên 300ms nếu vẫn thấy bị nháy
            } else {
                this.districtFormControl.setValue(matched);
            }
        }
    }


    // ======== Commune ========
    loadCommune(): void {
        const districtValue = this.districtFormControl?.value;
        if (!districtValue || !districtValue.categoriesCode) {
            this.communes = [];
            this.filteredCommunes = [];
            return;
        }

        this.subscription.add(
            this._addressService.getCommune(districtValue.categoriesCode).subscribe((res) => {
                this.communes = Array.isArray(res?.payload) ? res.payload : [];

                // Xử lý commune đã có sẵn nếu có
                if (Array.isArray(this.alreadyAddress) && this.alreadyAddress.length >= 3) {
                    const communeName = this.alreadyAddress[this.alreadyAddress.length - 3];
                    const alreadyCommune = this.communes.find(
                        (c) => c.categoriesName === communeName
                    );
                    if (alreadyCommune) {
                        this.communeFormControl.patchValue(alreadyCommune);
                    }
                }

                // Lọc autocomplete
                this.communeFormControl.valueChanges
                    .pipe(
                        startWith(''),
                        map((value) => (typeof value === 'string' ? value : value?.categoriesName)),
                        map((name) =>
                            name
                                ? this._filter(name, this.communes)
                                : this.communes.slice()
                        )
                    )
                    .subscribe((list) => (this.filteredCommunes = list));
            })
        );
    }

    onCommuneBlur(): void {
        const value = this.communeFormControl.value;

        if (typeof value === 'string') {
            const matched = this.communes.find((c) => c.categoriesName === value);

            if (!matched) {
                // Delay một chút để autocomplete không bị nháy
                setTimeout(() => {
                    // check lại lần nữa để tránh race-condition
                    const stillValue = this.communeFormControl.value;
                    if (typeof stillValue === 'string' && stillValue === value) {
                        this.communeFormControl.setValue(null);
                    }
                }, 200); // 200ms bạn có thể chỉnh thành 300ms nếu cần
            } else {
                this.communeFormControl.setValue(matched);
            }
        }
    }


    // ======== Helpers ========
    private _filter(name: string, collection: IBaseDataSourceObj[]): IBaseDataSourceObj[] {
        const filterValue = name.toLowerCase();
        return collection.filter((option) => option.categoriesName.toLowerCase().includes(filterValue));
    }



    onSubmit(): void {
        if (this.selectedTab === 0) {
            // Tab địa chỉ cũ
            this.formGroup.markAllAsTouched();
            if (this.formGroup.valid) {
                const dialogResult = {
                    type: 'old',
                    payload: this._addressService.getAddressSelectionData(this.formGroup.value).payload,
                };
                this.dialogRef.close(dialogResult);
            }
        } else {
            // Tab địa chỉ mới
            this.formGroupNew.markAllAsTouched();
            if (this.formGroupNew.valid) {
                const dialogResult = {
                    type: 'new',
                    payload: this.formGroupNew.value.newAddress,
                };
                this.dialogRef.close(dialogResult);
            }
        }
    }


}
