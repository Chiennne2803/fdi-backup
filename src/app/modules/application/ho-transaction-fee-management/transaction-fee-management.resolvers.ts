import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BaseResponse} from 'app/models/base';
import {Observable} from 'rxjs';
import {
    AccountManagementFeeService,
    DepositTransactionFeeService,
    InvestmentTransactionFeeService,
    LoanArrangementFeeService,
    OverdueInterestService,
    PersonalIncomeTaxService,
    TransferTransactionFeeService,
    WithdrawalTransactionFeeService
} from "../../../service/admin/managementTransactionFee";


//Phi thu xep khoan vay
@Injectable({providedIn: 'root'})
export class LoanArrangementFeeResolver implements Resolve<any> {
    constructor(private _loanArrangementFeeService: LoanArrangementFeeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._loanArrangementFeeService.searchLoanArrangementFee();
    }
}
@Injectable({providedIn: 'root'})
export class LoanArrangementFeeReqResolver implements Resolve<any> {
    constructor(private _loanArrangementFeeService: LoanArrangementFeeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._loanArrangementFeeService.searchLoanArrangementFeeReq();
    }
}
//Phi quan ly tai khoan
@Injectable({providedIn: 'root'})
export class AccountManagementFeeResolver implements Resolve<any> {
    constructor(private _resolve: AccountManagementFeeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchAccountManagementFee();
    }
}
@Injectable({providedIn: 'root'})
export class AccountManagementFeeReqResolver implements Resolve<any> {
    constructor(private _resolve: AccountManagementFeeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchAccountManagementFeeReq();
    }
}

//-----phi giao dich nap tien
@Injectable({providedIn: 'root'})
export class DepositTransactionFeeResolver implements Resolve<any> {
    constructor(private _resolve: DepositTransactionFeeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchDepositTransactionFee();
    }
}
@Injectable({providedIn: 'root'})
export class DepositTransactionFeeReqResolver implements Resolve<any> {
    constructor(private _resolve: DepositTransactionFeeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchDepositTransactionFeeReq();
    }
}

//-----phi giao dich dau tu
@Injectable({providedIn: 'root'})
export class InvestmentTransactionFeeResolver implements Resolve<any> {
    constructor(private _resolve: InvestmentTransactionFeeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchInvestmentTransactionFee();
    }
}
@Injectable({providedIn: 'root'})
export class InvestmentTransactionFeeReqResolver implements Resolve<any> {
    constructor(private _resolve: InvestmentTransactionFeeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchInvestmentTransactionFeeReq();
    }
}

//-----Lai qua han
@Injectable({providedIn: 'root'})
export class OverdueInterestResolver implements Resolve<any> {
    constructor(private _resolve: OverdueInterestService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchOverdueInterest();
    }
}
@Injectable({providedIn: 'root'})
export class OverdueInterestReqResolver implements Resolve<any> {
    constructor(private _resolve: OverdueInterestService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchOverdueInterestReq();
    }
}

//-----Thue thu nhap ca nhan
@Injectable({providedIn: 'root'})
export class PersonalIncomeTaxResolver implements Resolve<any> {
    constructor(private _resolve: PersonalIncomeTaxService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchPersonalIncomeTax();
    }
}
@Injectable({providedIn: 'root'})
export class PersonalIncomeTaxReqResolver implements Resolve<any> {
    constructor(private _resolve: PersonalIncomeTaxService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchPersonalIncomeTaxReq();
    }
}

//-----Phi giao dich chuyen nhuong
@Injectable({providedIn: 'root'})
export class TransferTransactionFeeResolver implements Resolve<any> {
    constructor(private _resolve: TransferTransactionFeeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchTransferTransactionFee();
    }
}
@Injectable({providedIn: 'root'})
export class TransferTransactionFeeReqResolver implements Resolve<any> {
    constructor(private _resolve: TransferTransactionFeeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchTransferTransactionFeeReq();
    }
}

//-----phi giao dich rut tien
@Injectable({providedIn: 'root'})
export class WithdrawalTransactionFeeResolver implements Resolve<any> {
    constructor(private _resolve: WithdrawalTransactionFeeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchWithdrawalTransactionFee();
    }
}
@Injectable({providedIn: 'root'})
export class WithdrawalTransactionFeeReqResolver implements Resolve<any> {
    constructor(private _resolve: WithdrawalTransactionFeeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._resolve.searchWithdrawalTransactionFeeReq();
    }
}
