// import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAu6sdLl1ngCpOdHhx69xWJuBGS8QYUToE",
  authDomain: "react-android-a923a.firebaseapp.com",
  databaseURL:
    "https://react-android-a923a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "react-android-a923a",
  storageBucket: "react-android-a923a.appspot.com",
  messagingSenderId: "904576134150",
  appId: "1:904576134150:web:03fd3eee6c11659d1ea787",
  measurementId: "G-THZJ4R96V4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };

// const firebaseConfig = {
//   apiKey: "AIzaSyC-_nHZGUMOyMLwSwZIBKypP5lGxSFDYwk",
//   authDomain: "react-android-6523e.firebaseapp.com",
//   databaseURL:
//     "https://react-android-6523e-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "react-android-6523e",
//   storageBucket: "react-android-6523e.appspot.com",
//   messagingSenderId: "269425320012",
//   appId: "1:269425320012:web:921737c61e8abd190854e9",
// };

// const app = initializeApp(firebaseConfig);
