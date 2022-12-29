import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, Unsubscribe
} from "firebase/auth";
import {
    addDoc,
    collection, deleteDoc, doc, documentId, getDoc, getDocs, getFirestore,
    onSnapshot, query, setDoc, updateDoc, where
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Dispatch } from "react";
import { ChatRoom } from "../interfaces/ChatRoom";
import { IProfile } from "../interfaces/Profile";

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
                avatar: user.photoURL,
                friendIds: [],
                chatRoomIds: [],
            } as IProfile);
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
            avatar: '',
            friendIds: [],
            chatRoomIds: [],
        } as IProfile);

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
// set profile is a function that takes in a profile object and sets it to state

const getProfile = (uid: string, setProfile: Dispatch<IProfile>): Unsubscribe | undefined => {
    try {
        // document has the same id as the uid
        const docRef = doc(db, "users", uid);
        // check if the document exists in the cache
        const unsubscribe = onSnapshot(docRef, (snap) => {
            setProfile(snap.data() as IProfile)
        })

        return unsubscribe;
    } catch (error) {
        console.log(error);
    }
}

const getFriends = (friendIds: string[], setFriends: Dispatch<IProfile[]>): Unsubscribe | undefined => {
    try {
        const q = query(collection(db, "users"), where(documentId(), 'in', friendIds));
        const unsubscribe = onSnapshot(q, (snap) => setFriends(snap.docs.map((d) => d.data() as IProfile)))
        return unsubscribe;
    } catch (error) {
        console.log(error);
    }

}

const deleteProfile = async (uid: string) => {
    try {
        // document has the same id as the uid
        const docRef = doc(db, "users", uid);
        await deleteDoc(docRef);
        // and then delete the user from auth
        await auth.currentUser?.delete();
    } catch (error) {
        console.log(error);
    }
}



const getChatRoomByMembers = (memberIds: string[], setChatRoom: Dispatch<ChatRoom>): Unsubscribe | undefined => {
    try {
        const q = query(collection(db, 'chatRooms'), where("memberIds", "==", memberIds));
        const unsubscribe = onSnapshot(q, (snap) => {
            let chatRoom = {
                uid: snap.docs[0].id,
                ...snap.docs[0]?.data()
            }
            console.log("chatroom snap", chatRoom);
            setChatRoom(chatRoom as ChatRoom);
        })
        return unsubscribe;
    } catch (error) {
        console.log(error);
    }
}

const createChatRoom = async (memberIds: string[]): Promise<void> => {
    try {
        let chatRoom: ChatRoom = {
            memberIds,
            messages: [],
            imageUrl: '',
            name: '',
        }
        const d = await addDoc(collection(db, "chatRooms"), chatRoom);
        // update the chatRoomIds of the members
        memberIds.forEach(async (memberId) => {
            const docRef = doc(db, "users", memberId);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                console.log("No such document!");
                return;
            }
            const profile = docSnap.data() as IProfile;
            console.log(profile)
            await updateDoc(docRef, {
                chatRoomIds: [...profile.chatRoomIds, d.id],
            });
        })
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
    getProfile,
    deleteProfile,
    getChatRoomByMembers,
    createChatRoom,
    getFriends
};

