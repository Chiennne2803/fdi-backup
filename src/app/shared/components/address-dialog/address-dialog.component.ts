import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddressService } from 'app/service/common-service/address.service';
import { APP_TEXT } from 'app/shared/constants';
import { IBaseDataSourceObj } from 'app/shared/models/base.model';
import { map, startWith, Subscription } from 'rxjs';

@Component({
    selector: 'app-address-dialog',
    templateUrl: './address-dialog.component.html',
    styleUrls: ['./address-dialog.component.scss']
})
export class AddressDialogComponent implements OnInit, OnDestroy {
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
        public dialogRef: MatDialogRef<AddressDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string,
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
        // If already address value
        if (this.data) {
            this.alreadyAddress = this.data.split(', ');
        }

        this.loadProvince();
        this.streetAddressFormControl.patchValue(this.alreadyAddress[this.alreadyAddress.length - 4]);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initAreaForm(): void {
        this.formGroup = this._fb.group({
            province: this._fb.control('', Validators.required),
            district: this._fb.control('', Validators.required),
            commune: this._fb.control('', Validators.required),
            street: this._fb.control('', Validators.required),
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
                this.provinces = res.payload as IBaseDataSourceObj[];
                const alreadyProvince = this.provinces.find(
                    (p) => p.categoriesName === this.alreadyAddress[this.alreadyAddress.length - 1]
                );
                if (alreadyProvince) {
                    this.provinceFormControl.patchValue(alreadyProvince);
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
        if (this.provinceFormControl.valid) {
            this.subscription.add(
                this._addressService.getDistrict(this.provinceFormControl.value.categoriesCode).subscribe((res) => {
                    this.districts = res.payload as IBaseDataSourceObj[];
                    const alreadyDistrict = this.districts.find(
                        (d) => d.categoriesName === this.alreadyAddress[this.alreadyAddress.length - 2]
                    );
                    if (alreadyDistrict) {
                        this.districtFormControl.patchValue(alreadyDistrict);
                    }
                    this.districtFormControl.valueChanges
                        .pipe(
                            startWith(''),
                            map((value) => (typeof value === 'string' ? value : value?.categoriesName)),
                            map((name) => (name ? this._filter(name, this.districts) : this.districts.slice()))
                        )
                        .subscribe((list) => (this.filteredDistricts = list));

                    this.loadCommune();
                })
            );
        }
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
        if (this.districtFormControl.valid) {
            this.subscription.add(
                this._addressService.getCommune(this.districtFormControl.value.categoriesCode).subscribe((res) => {
                    this.communes = res.payload as IBaseDataSourceObj[];
                    const alreadyCommune = this.communes.find(
                        (c) => c.categoriesName === this.alreadyAddress[this.alreadyAddress.length - 3]
                    );
                    if (alreadyCommune) {
                        this.communeFormControl.patchValue(alreadyCommune);
                    }
                    this.communeFormControl.valueChanges
                        .pipe(
                            startWith(''),
                            map((value) => (typeof value === 'string' ? value : value?.categoriesName)),
                            map((name) => (name ? this._filter(name, this.communes) : this.communes.slice()))
                        )
                        .subscribe((list) => (this.filteredCommunes = list));
                })
            );
        }
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
        this.formGroup.markAllAsTouched();
        if (this.formGroup.valid) {
            // console.log(this.formGroup.value)
            const value = this.formGroup.value
            const payload = `${value.street}, ${value.commune.categoriesName}, ${value.district.categoriesName}, ${value.province.categoriesName}`;
            // const dialogResult = this._addressService.getAddressSelectionData(this.formGroup.value);
            this.dialogRef.close(payload);
        }
    }

}
