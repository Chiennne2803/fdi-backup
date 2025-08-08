/* eslint-disable id-blacklist */
export interface IBorrowerDashboardResponse {
    errorCode: string;
    message: string;
    paramMessage: string;
    payload: {
        accountBalance: number;
        totalDebit: number;
        totalInvestApproval: number;
        totalInvestWaiting: number;
        totalProfileApproval: number;
        totalProfileWaiting: number;
    };
}
