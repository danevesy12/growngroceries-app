// authMethods.js
import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider
} from 'firebase/auth';

// Email/Password
export const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// Facebook
export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  return signInWithPopup(auth, provider);
};

// Apple
export const signInWithApple = async () => {
  const provider = new OAuthProvider('apple.com');
  return signInWithPopup(auth, provider);
};
