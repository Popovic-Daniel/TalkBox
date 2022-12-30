import {
  createUserWithEmailAndPassword,
  getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, Unsubscribe,
} from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection, deleteDoc, doc, documentId, getDoc, getDocs, getFirestore,
  onSnapshot, query, setDoc, updateDoc, where,
} from 'firebase/firestore'
import { Dispatch } from 'react'
import { ChatRoom } from '../interfaces/ChatRoom'
import { IProfile } from '../interfaces/Profile'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyASMZuxHMj6fV6xH6W8fj_fVpmw6IgD5s8',
  authDomain: 'talkbox-15d1b.firebaseapp.com',
  projectId: 'talkbox-15d1b',
  storageBucket: 'talkbox-15d1b.appspot.com',
  messagingSenderId: '135377945092',
  appId: '1:135377945092:web:ae9e0d3e65e644db0eab51'
}

// Initialize Firebase
initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore()

const googleProvider = new GoogleAuthProvider()
const signInWithGoogle = async (): Promise<void> => {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    const user = res.user
    const q = query(collection(db, 'users'), where('uid', '==', user.uid))
    const docs = await getDocs(q)
    if (docs.empty) {
      // save user to firestore using setDoc with the id being the uid
      const profile: IProfile = {
        uid: user.uid,
        name: user.displayName ?? '',
        authProvider: 'google',
        email: user.email ?? '',
        avatar: user.photoURL ?? '',
        friendIds: [],
        chatRoomIds: []
      }
      await setDoc(doc(db, 'users', user.uid), profile)
    }
  } catch (error) {
    console.log(error)
  }
}

const loginWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    console.log(error)
  }
}

const registerUserWithEmailAndPassword = async (email: string, password: string, userName: string): Promise<void> => {
  const res = await createUserWithEmailAndPassword(auth, email, password)
  const user = res.user
  const profile: IProfile = {
    uid: user.uid,
    name: userName,
    authProvider: 'email',
    email: user.email ?? '',
    avatar: '',
    friendIds: [],
    chatRoomIds: []
  }
  await setDoc(doc(db, 'users', user.uid), profile)
}

const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    console.log(error)
  }
}

const logout = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error) {
    console.log(error)
  }
}
// set profile is a function that takes in a profile object and sets it to state

const getProfile = (uid: string, setProfile: Dispatch<IProfile>): Unsubscribe | undefined => {
  try {
    // document has the same id as the uid
    const docRef = doc(db, 'users', uid)
    // check if the document exists in the cache
    const unsubscribe = onSnapshot(docRef, (snap) => {
      setProfile(snap.data() as IProfile)
    })

    return unsubscribe
  } catch (error) {
    console.log(error)
  }
}

const getFriends = (friendIds: string[], setFriends: Dispatch<IProfile[]>): Unsubscribe | undefined => {
  try {
    const q = query(collection(db, 'users'), where(documentId(), 'in', friendIds))
    const unsubscribe = onSnapshot(q, (snap) => setFriends(snap.docs.map((d) => d.data() as IProfile)))
    return unsubscribe
  } catch (error) {
    console.log(error)
  }
}

const deleteProfile = async (uid: string): Promise<void> => {
  try {
    // document has the same id as the uid
    const docRef = doc(db, 'users', uid)
    await deleteDoc(docRef)
    // and then delete the user from auth
    await auth.currentUser?.delete()
  } catch (error) {
    console.log(error)
  }
}

const getChatRoomByMembers = (memberIds: string[], setChatRoom: Dispatch<ChatRoom>): Unsubscribe | undefined => {
  try {
    const q = query(collection(db, 'chatRooms'), where('memberIds', '==', memberIds))
    const unsubscribe = onSnapshot(q, (snap) => {
      const chatRoom = {
        uid: snap.docs[0].id,
        ...snap.docs[0]?.data()
      }
      setChatRoom(chatRoom as ChatRoom)
    })
    return unsubscribe
  } catch (error) {
    console.log(error)
  }
}

const createChatRoom = async (memberIds: string[]): Promise<void> => {
  try {
    const chatRoom: ChatRoom = {
      memberIds,
      messages: [],
      imageUrl: '',
      name: ''
    }
    const d = await addDoc(collection(db, 'chatRooms'), chatRoom)
    await updateUserChatRooms(memberIds, d.id)
  } catch (error) {
    console.log(error)
  }
}

async function updateUserChatRooms(memberIds: string[], documentId: string): Promise<void> {
  for (const member of memberIds) {
    const docRef = doc(db, 'users', member)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      console.log('No such document!')
      return
    }
    const profile = docSnap.data() as IProfile
    console.log(profile)
    await updateDoc(docRef, {
      chatRoomIds: [...profile.chatRoomIds, documentId]
    })
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
}
