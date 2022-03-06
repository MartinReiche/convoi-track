import {getApps, getApp, initializeApp} from 'firebase/app';
import {initializeAppCheck, ReCaptchaV3Provider} from 'firebase/app-check';

export function getFirebase() {
    if (getApps().length === 0) {
        // Init Firebase
        const app = initializeApp({
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            appId: process.env.REACT_APP_FIREBASE_APP_ID
        });

        // Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
        // key is the counterpart to the secret key you set in the Firebase console.
        if (process.env.REACT_APP_FIREBASE_APP_CHECK_DEBUG_MODE === "true") {
            // @ts-ignore
            // eslint-disable-next-line no-restricted-globals
            self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
        }

        initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(process.env.GATSBY_FIREBASE_RECAPTCHA_KEY as string),
            isTokenAutoRefreshEnabled: true
        });
        return app;
    } else {
        return getApp();
    }
}

export default getFirebase;
