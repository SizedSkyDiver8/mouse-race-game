import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOuREE_ritP1AAezd8ZPgkKxQQlHQcWks",
  authDomain: "priss-hw.firebaseapp.com",
  projectId: "priss-hw",
  storageBucket: "priss-hw.appspot.com",
  messagingSenderId: "149440778175",
  appId: "1:149440778175:web:755a16771234e77d245b0a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

export { firestore };
