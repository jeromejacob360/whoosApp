import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// enableIndexedDbPersistence(db).catch((err) => {
//   if (err.code === 'failed-precondition') {
//     console.log(
//       'Multiple tabs open, offline mode can only be enabled in one tab at a a time.',
//     );
//   } else if (err.code === 'unimplemented') {
//     console.log(
//       'The current browser does not support all of the features required to enable offline mode',
//     );
//   }
// });

export { db };
