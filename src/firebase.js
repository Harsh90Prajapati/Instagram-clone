import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBCVcbarG9kt820lCy9MDGP4WdISUQGLX8",
    authDomain: "instagram-app-d3d4a.firebaseapp.com", 
    projectId: "instagram-app-d3d4a",
    storageBucket: "instagram-app-d3d4a.appspot.com",
    messagingSenderId: "1058197695201",
    appId: "1:1058197695201:web:aa55fccdc455a420a865a0",
    measurementId: "G-0T2GE4HJX8"
 });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

 export { db, auth, storage };