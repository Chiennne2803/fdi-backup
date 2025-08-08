import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedUIModule } from './components/shared-ui.module';
import {SafeHtml} from './pipes/safe-html.pipe';

const ANGULAR_MATERIAL = [
    MatSnackBarModule,
];

@NgModule({
    declarations: [
        SafeHtml,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedUIModule,
        ...ANGULAR_MATERIAL,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedUIModule,
        SafeHtml,
        ...ANGULAR_MATERIAL,
    ],
    providers: [
    ]
})
export class SharedModule {
}
