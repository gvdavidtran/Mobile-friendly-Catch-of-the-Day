import Rebase from 're-base';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDPCub19JnbbRHyL1fW1uQGSodz-zcXpdM",
    authDomain: "catch-of-the-day-david-t-7b872.firebaseapp.com",
    databaseURL: "https://catch-of-the-day-david-t-7b872.firebaseio.com",
  });

const base = Rebase.createClass(firebaseApp.database());

//This is a named export
export { firebaseApp };

// This is a default export
export default base;