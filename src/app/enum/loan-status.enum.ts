/* eslint-disable @typescript-eslint/naming-convention */
export enum LoanStatus {
    RECEIVE = 1,
    WAIT_FOR_PROCESS = 2,
    REWORK = 5,
    WAIT_FOR_REVIEW = 6,
    APPROVE = 3,
    REJECT = 4,
    DISBURSEMENT = 8,
    WAIT_FOR_PAYMENT = 9,
    CLOSE = 10,
    CANCEL = 7
}
