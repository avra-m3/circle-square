import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from '@firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyBj43GDGJRnYg8TAKoP8r63KBWGOc1D5Kk",
    authDomain: "circle-square-7c212.firebaseapp.com",
    databaseURL: "https://circle-square-7c212-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "circle-square-7c212",
    storageBucket: "circle-square-7c212.appspot.com",
    messagingSenderId: "323065520616",
    appId: "1:323065520616:web:88273f64d77bebe32ec45d",
    measurementId: "G-Z19NLCWTSN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);