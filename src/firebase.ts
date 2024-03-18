import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAyLW7Pe5mmde6rUcQt89kCPY5wCbV2Eb0',
  authDomain: 'ywitter-fcd69.firebaseapp.com',
  projectId: 'ywitter-fcd69',
  storageBucket: 'ywitter-fcd69.appspot.com',
  messagingSenderId: '17515678044',
  appId: '1:17515678044:web:3a7ce8818a095c3a3b5999',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
