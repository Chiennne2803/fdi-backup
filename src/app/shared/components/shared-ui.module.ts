import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { FuseAlertModule } from '../../../@fuse/components/alert';
import { FuseCardModule } from '../../../@fuse/components/card';
import { FuseDrawerModule } from '../../../@fuse/components/drawer';
import { AutoFocusDirective } from '../directives/auto-focus.directive';
import { InputMaskDirective } from '../directives/input-mask.component';
import { AddressDialogComponent } from './address-dialog/address-dialog.component';
import { AppRadialBarChartComponent } from './app-radial-bar-chart/app-radial-bar-chart.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ConfirmProcessingComponent } from './confirm-processing/confirm-processing.component';
import { DatatableComponent } from './datatable/datatable.component';
import { DatePickerYearOnlyComponent } from './date-picker-year-only/date-picker-year-only.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { AddressKycDialogComponent } from './dialog/address-dialog/address-dialog.component';
import { MakeWithdrawDialogsComponent } from './dialog/make-withdraw/make-withdraw-dialogs.component';
import { OtpEmailComponent } from './dialog/otp-email/otp-email.component';
import {
    RechargeRequestDialogsComponent,
    RechargeRequestSaveDialogsComponent
} from './dialog/recharge-request/recharge-request-dialogs.component';
import { UploadFileDialogComponent } from './dialog/upload-file/upload-file.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { FileComponent } from './file/file.component';
import { GroupSearchComponent } from './group-search/group-search.component';
import { ContactCustomerServiceComponent } from './kyc/contact-customer-service/contact-customer-service.component';
import { KycDetailComponent } from './kyc/kyc-details/kyc-detail.component';
import { KycFinishComponent } from './kyc/kyc-finish/kyc-finish.component';
import { KycStarterComponent } from './kyc/kyc-starter/kyc-starter.component';
import { ModalNotifyComponent } from './modal-notify/modal-notify.component';
import { OtpConfirmComponent } from './otp-confirm/otp-confirm.component';
import { OtpSmsConfirmComponent } from './otp-sms-confirm/otp-sms-confirm.component';
import { DateTimeformat2Pipe, DateTimeformatPipe } from './pipe/date-time-format.pipe';
import { CurrencyFormatPipe, DecimalFormatPipe, TooltipListPipe } from './pipe/string-format.pipe';
import { SignRequestDialogComponent } from './sign-request-dialog/sign-request-dialog.component';
import { StatusDisplayComponent } from './status-display/status-display.component';
import { getVietNamPaginatorIntl } from './vi-paginator-intl';
import {TranslocoModule} from "@ngneat/transloco";
import {PermissionPipe} from "./pipe/permission.pipe";
import {TrimInputDirective} from "../directives/trim-input.directive";
import {LowerCaseInputDirective} from "../directives/lower-case-input.directive";
import { BalanceCardComponent } from './balance-card/balance-card.component';
// import { NgOtpInputModule } from 'ng-otp-input';
// import { SwiperModule } from 'swiper/angular';

const CUSTOM_PIPE = [
    CurrencyFormatPipe,
    DecimalFormatPipe,
    TooltipListPipe,
    DateTimeformat2Pipe,
    DateTimeformatPipe,
    PermissionPipe
];

@NgModule({
    declarations: [
        DatatableComponent,
        ...CUSTOM_PIPE,
        DateTimeformatPipe,
        OtpConfirmComponent,
        DropzoneComponent,
        OtpSmsConfirmComponent,
        ModalNotifyComponent,
        FileComponent,
        KycStarterComponent,
        KycDetailComponent,
        AddressKycDialogComponent,
        OtpEmailComponent,
        KycFinishComponent,
        ModalNotifyComponent,
        AddressDialogComponent,
        ConfirmProcessingComponent,
        FileDetailComponent,
        MakeWithdrawDialogsComponent,
        RechargeRequestDialogsComponent,
        RechargeRequestSaveDialogsComponent,
        ContactCustomerServiceComponent,
        SignRequestDialogComponent,
        UploadFileDialogComponent,
        StatusDisplayComponent,
        GroupSearchComponent,
        AvatarComponent,
        DatePickerComponent,
        DatePickerYearOnlyComponent,
        AppRadialBarChartComponent,
        InputMaskDirective,
        TrimInputDirective,
        LowerCaseInputDirective,
        AutoFocusDirective,
        BalanceCardComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatIconModule,
        MatSortModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatButtonModule,
        MatInputModule,
        MatTableModule,
        MatCheckboxModule,
        FuseAlertModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatTooltipModule,
        MatStepperModule,
        NgxTrimDirectiveModule,
        FuseCardModule,
        MatTabsModule,
        MatSelectModule,
        MatSidenavModule,
        FuseDrawerModule,
        MatDatepickerModule,
        MatMomentDateModule,
        RouterModule,
        NgxDropzoneModule,
        MatOptionModule,
        MatSnackBarModule,
        MatDividerModule,
        MatRadioModule,
        CurrencyMaskModule,
        NgApexchartsModule,
        TranslocoModule,
        // SwiperModule,  
        // NgOtpInputModule
    ],
    exports: [
        DatatableComponent,
        ...CUSTOM_PIPE,
        OtpConfirmComponent,
        DateTimeformatPipe,
        FileComponent,
        DropzoneComponent,
        OtpSmsConfirmComponent,
        ModalNotifyComponent,
        AddressKycDialogComponent,
        ModalNotifyComponent,
        KycStarterComponent,
        KycDetailComponent,
        AddressDialogComponent,
        OtpEmailComponent,
        KycFinishComponent,
        ConfirmProcessingComponent,
        FileDetailComponent,
        MakeWithdrawDialogsComponent,
        RechargeRequestDialogsComponent,
        RechargeRequestSaveDialogsComponent,
        ContactCustomerServiceComponent,
        SignRequestDialogComponent,
        StatusDisplayComponent,
        GroupSearchComponent,
        AvatarComponent,
        DatePickerComponent,
        DatePickerYearOnlyComponent,
        AppRadialBarChartComponent,
        InputMaskDirective,
        TrimInputDirective,
        LowerCaseInputDirective,
        AutoFocusDirective,
        NgxTrimDirectiveModule,
        BalanceCardComponent,
    ],
    providers: [
        { provide: MatPaginatorIntl, useValue: getVietNamPaginatorIntl() },
    ]
})
export class SharedUIModule {
}
