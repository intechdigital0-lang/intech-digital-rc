import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// use initializeFirestore with long polling for better reliability in the dev environment
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export const ADMIN_EMAILS = [
  "intechdigital0@gmail.com" // User's email from metadata
];

export const isUserAdmin = (email: string | null) => {
  return email && ADMIN_EMAILS.includes(email);
};

export const checkAdminStatus = async (uid: string): Promise<boolean> => {
  try {
    const adminDoc = await getDocFromServer(doc(db, 'admins', uid));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
