import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: "AIzaSyANZ5Ki9QnwJ3eP_5dgNFfK7YEHf3uZ6w0",
    authDomain: "filmtips-66e1a.firebaseapp.com",
    databaseURL: "https://filmtips-66e1a.firebaseio.com",
    projectId: "filmtips-66e1a",
    storageBucket: "filmtips-66e1a.appspot.com",
    messagingSenderId: "90065452200"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
    db,
    auth
}