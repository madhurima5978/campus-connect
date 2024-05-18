// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app'; // Import from 'firebase/compat/app'
import 'firebase/compat/auth'; // Import other modules you need from firebase/compat
import 'firebase/compat/firestore';
import 'firebase/messaging';
import { getStorage, ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCF9Fsdf6lAWlZcw1I0WuYiPfDOOvySPuQ",
  authDomain: "campusconn-b167a.firebaseapp.com",
  projectId: "campusconn-b167a",
  storageBucket: "gs://campusconn-b167a.appspot.com",
  messagingSenderId: "543138984098",
  appId: "1:543138984098:web:87bd65f93cb0dd7b7327fb",
  measurementId: "G-N15ZZ0XLBH"
};

// Initialize Firebase
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = firebase.firestore()
// const firebaseApp = getApp();
const storage = getStorage(app, "gs://campusconn-b167a.appspot.com");
export {firebase, db, storage};
