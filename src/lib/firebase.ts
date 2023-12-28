import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAJRFWXzg0tad39Cc8PT5QJXVG4TuBPrlg",
  authDomain: "sharebase-2e287.firebaseapp.com",
  projectId: "sharebase-2e287",
  storageBucket: "sharebase-2e287.appspot.com",
  messagingSenderId: "945634828802",
  appId: "1:945634828802:web:c1011987248155c572fd1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };