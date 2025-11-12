export const baseHost = 'http://113.20.107.211:8090';

export const environment = {
    baseUrl: `${baseHost}/catalog/`,        
    loginUrl: `${baseHost}/catalog/vsa/v1/oauth/token?grant_type=password`,
    refreshTokenUrl: `${baseHost}/catalog/vsa/v1/oauth/token`,
    logoutUrl: `${baseHost}/api/gateway/revoke`,
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
    encryptKey: 'bGlua2ZpaW5Xb21lbkRheQ==', 
    clientId: 'ZmRpQGNsaWVudElkQDAzMDMyMDI1',
    clientSecret: 'ZmRpQGNsaWVudFNlY3JldEAwMzAzMjAyNQ==',

    production: false,
    appName: 'LINKFIIN',
    serverUrlnotVsa: `${baseHost}/catalog`,
    serverUrl: `${baseHost}/catalog/vsa/service`,
    applicationService: `${baseHost}/catalog/truongtien/api`,

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