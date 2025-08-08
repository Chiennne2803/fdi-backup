/* eslint-disable @typescript-eslint/naming-convention */
export enum TransInvestorStatus {
    WAIT = 1,
    APPROVAL = 2,
    REJECT = 3,
    DO_INVEST = 4,
    COMPLETE_INVEST = 5
}

export enum TransInvestorType {
    AUTO = 1,
    MANUAL = 2,
    TRANSF = 3
}


export enum FSTranspayPeriodStatus {
    WAIT_PAY = 1,
    PAID = 2
}

export enum FSCardDownStatus {
    DRAFT = 1,
    WAITING_PROGRESSING = 2,
    APPROVE = 3,
    REJECT = 4,
}

export enum FSTransPayReqStatus {
    WAITING_PAY = 1,
    WAITING_PROGRESSING = 2,
    WAITING_APPROVE = 3,
    APPROVE = 4,
    REJECT = 5,
    TIME_OUT = 6,
}
