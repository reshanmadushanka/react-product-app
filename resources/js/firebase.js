// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA4P3B0E-dVtjeBaDUfiSIh38F5N4DJYLc",
    authDomain: "react-app-ff890.firebaseapp.com",
    projectId: "react-app-ff890",
    storageBucket: "react-app-ff890.appspot.com",
    messagingSenderId: "235010380248",
    appId: "1:235010380248:web:9a905e8ba5f95afcd462ad",
    measurementId: "G-B4V79VEWTC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
