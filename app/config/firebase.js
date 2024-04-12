import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBt1zQnyf4HoaSIzx_0w882CxVoAibQ-co",
  authDomain: "hungry-slug-4fa78.firebaseapp.com",
  projectId: "hungry-slug-4fa78",
  storageBucket: "hungry-slug-4fa78.appspot.com",
  messagingSenderId: "301964856205",
  appId: "1:301964856205:web:4e440461dcd60b5c0f8bc4",
  measurementId: "G-1VB5HVE3QY"
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth };
