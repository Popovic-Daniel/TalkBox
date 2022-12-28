import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut
} from "firebase/auth";
import {
    collection, doc, getDocs, getFirestore,
    query, setDoc, where
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyASMZuxHMj6fV6xH6W8fj_fVpmw6IgD5s8",
    authDomain: "talkbox-15d1b.firebaseapp.com",
    projectId: "talkbox-15d1b",
    storageBucket: "talkbox-15d1b.appspot.com",
    messagingSenderId: "135377945092",
    appId: "1:135377945092:web:ae9e0d3e65e644db0eab51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.empty) {
            // save user to firestore using setDoc with the id being the uid
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });

        }

    } catch (error) {
        console.log(error);
    }
}

const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
    }
}

const registerUserWithEmailAndPassword = async (email: string, password: string, userName: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: userName,
            authProvider: "email",
            email: user.email,
        });

    } catch (error) {
        throw error;
    }
}

const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.log(error);
    }
}

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.log(error);
    }
}

export {
    auth,
    db,
    signInWithGoogle,
    loginWithEmailAndPassword,
    registerUserWithEmailAndPassword,
    sendPasswordReset,
    logout,
};

