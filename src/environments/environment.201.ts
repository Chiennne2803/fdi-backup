
export const baseHost = 'https://test.linkfiin.vn';
export const environment = {
    baseUrl: `${baseHost}/catalog/`,
    loginUrl: `${baseHost}/catalog/vsa/v1/oauth/token?grant_type=password`,
    refreshTokenUrl: `${baseHost}/catalog/vsa/v1/oauth/token?grant_type=refresh_token`,
    logoutUrl: `${baseHost}/catalog/vsa/v1/token/revoke`,
    registerUrl: `${baseHost}/catalog/register`,
    verifyOtpUrl: `${baseHost}/catalog/register/verify`,
    forgotPasswordUrl: `${baseHost}/catalog/forgetPassword/sendOtpRecoverPassword`,
    forgotPasswordVerifyOtpUrl: `${baseHost}/catalog/forgetPassword/verify`,
    forgotPasswordResendOtpUrl: `${baseHost}/catalog/forgetPassword/resend`,
    forgotPasswordVerifyTokenUrl: `${baseHost}/catalog/forgetPassword/verifyUrl`,
    updateNewPassword: `${baseHost}/catalog/forgetPassword/updateNewPassword`,
    contextPathUrl: `${baseHost}/catalog/vsa/service/`,
    loanReviewsUrl: `${baseHost}/catalog/vsa/service/fsLoanProfilesReview/search`,
    loanCallingUrl: `${baseHost}/catalog/vsa/service/fsLoanProfiles/search`,
    loanArchiveUrl: `${baseHost}/catalog/vsa/service/fsLoanProfilesStore/search`,
    loanPrepareLoadingPage: `${baseHost}/catalog/vsa/service/fsLoanProfiles/prepareLoadingPage`,
    withdrawPrepareLoadingPage: `${baseHost}/catalog/vsa/service/transWithdrawCash/prepareLoadingPage`,

    //key
    encryptKey: 'bGlua2ZpaW5Xb21lbkRheQ==', //fdi@encryptkey@03032025(len:16)
    clientId: 'ZmRpQGNsaWVudElkQDAzMDMyMDI1', // fdi@clientId@03032025
    clientSecret: 'ZmRpQGNsaWVudFNlY3JldEAwMzAzMjAyNQ==', //fdi@clientSecret@03032025

    production: false,
    appName: 'LINKFIIN',
    serverUrlnotVsa: `${baseHost}/catalog`,
    serverUrl: `${baseHost}/catalog/vsa/service`,
    pageSizeOptions: [10, 25, 50, 75, 100],
    defaultPageSize: 10,
    firebaseConfig: {
        apiKey: "AIzaSyDz0poBxYkKKiP6XmpR-L1cJ5xu_nxPQUg",
        authDomain: "linkfiin-c93b6.firebaseapp.com",
        projectId: "linkfiin-c93b6",
        storageBucket: "linkfiin-c93b6.firebasestorage.app",
        messagingSenderId: "213900917255",
        appId: "1:213900917255:web:92f72f14cdfa07267048a2",
        measurementId: "G-H429V0D57C"
    },
    encryptionKey: 'cedfc70cfbf54ee32819d97037eb316891ed1e0f801d2bed441366b615caeefa'
};