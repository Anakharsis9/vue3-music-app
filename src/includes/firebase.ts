import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC9FPcO5ItIwZBUxEyb9smNb-6-muxbrj0',
  authDomain: 'music-ecb10.firebaseapp.com',
  projectId: 'music-ecb10',
  storageBucket: 'music-ecb10.appspot.com',
  appId: '1:55270374227:web:7aa73ffe3c75be3d6effa6',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const usersCollection = collection(db, 'users');

export { auth, db, usersCollection, addDoc, createUserWithEmailAndPassword };
