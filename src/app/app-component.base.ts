import { Component, Injector, OnDestroy } from '@angular/core';
import { HashMap, TranslateParams, TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { AppConst, APP_TEXT, ROUTER_CONST } from './shared/constants';

@Component({
    template: ''
})
export abstract class AppBaseComponent implements OnDestroy {
    public routerConst = ROUTER_CONST;
    public appText = APP_TEXT;
    public appConst = AppConst;

    unsubscribeAll = new Subject();

    translocoService: TranslocoService;

    constructor(
        public injector: Injector
    ) {
        this.translocoService = injector.get(TranslocoService);
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    l(key: TranslateParams, params?: HashMap, lang?: string): string {
        return this.translocoService.translate(key, params, lang);
    }
}
