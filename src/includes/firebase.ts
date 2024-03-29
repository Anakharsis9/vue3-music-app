import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

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
const songsCollection = collection(db, 'songs');
const commentsCollection = collection(db, 'comments');

const storage = getStorage(app);
const storageRef = ref(storage);

export { auth, db, usersCollection, songsCollection, commentsCollection, storage, storageRef };
