export const baseHost = 'http://113.20.107.38:8090';

export const environment = {
    baseUrl: `${baseHost}/catalog/`,
    loginUrl: `${baseHost}/catalog/vsa/v1/oauth/token?grant_type=password`,
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
    encryptKey: 'ZmRpQGVuY3J5cHRr', //fdi@encryptkey@03032025(len:16)
    clientId: 'ZmRpQGNsaWVudElkQDAzMDMyMDI1', // fdi@clientId@03032025
    clientSecret: 'ZmRpQGNsaWVudFNlY3JldEAwMzAzMjAyNQ==', //fdi@clientSecret@03032025

    production: false,
    appName: 'LINFIIN',
    serverUrlnotVsa: `${baseHost}/catalog`,
    serverUrl: `${baseHost}/catalog/vsa/service`,
    applicationService: `${baseHost}/catalog/truongtien/api`,
    logoutUrl: `${baseHost}/catalog/vsa/v1/token/revoke`,

    pageSizeOptions: [2, 10, 25, 50, 100],
    defaultPageSize: 10,
    firebaseConfig : {
        apiKey: "AIzaSyBQySwi4aoBW2og9PfXonTmYo057QI63aw",
        authDomain: "-f7c4a.firebaseapp.com",
        projectId: "-f7c4a",
        storageBucket: "-f7c4a.appspot.com",
        messagingSenderId: "813979058786",
        appId: "1:813979058786:web:b28c913367feed3257c73b",
        measurementId: "G-1PQ3WXPQK0"
    }
};
