import {auth} from './firebase';

//Create account
export const doCreateUserWithEmailAndPassword = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password);

//Sign in
export const doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

//Sign out
export const doSignOut = () =>
    auth.signOut();

//Reset password
export const doPasswordReset = (email) =>
    auth.sendPasswordResetEmail(email);

//Update password
export const doPasswordUpdate = (password) =>
    auth.currentUser.updatePassword(password);
