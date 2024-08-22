import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Define the Firebase configuration type
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Your web app's Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyCAifs3G5ulm8fHHV40JH0N3z1eyxrdj7w",
  authDomain: "todo-list-9e346.firebaseapp.com",
  projectId: "todo-list-9e346",
  storageBucket: "todo-list-9e346.appspot.com",
  messagingSenderId: "1075707759477",
  appId: "1:1075707759477:web:e29e05d558d89fac3d213c",
  measurementId: "G-SJYGY9D0S7",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
