import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Auth, getAuth } from '@firebase/auth';


const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: "circle-square-7c212.firebaseapp.com",
    databaseURL: "https://circle-square-7c212-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "circle-square-7c212",
    storageBucket: "circle-square-7c212.appspot.com",
    messagingSenderId: "323065520616",
    appId: "1:323065520616:web:88273f64d77bebe32ec45d",
    measurementId: "G-Z19NLCWTSN"
};


const isSSR = typeof window === 'undefined'
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = (isSSR ? null : getAnalytics(app)) as Analytics;
export const auth = (isSSR ? null : getAuth(app)) as Auth;