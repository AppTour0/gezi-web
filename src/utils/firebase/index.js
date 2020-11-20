import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAH56k4HPGMyi14vf477LRe8qGZWDSn93E",
  authDomain: "appturismo-cb8fa.firebaseapp.com",
  databaseURL: "https://appturismo-cb8fa.firebaseio.com",
  projectId: "appturismo-cb8fa",
  storageBucket: "appturismo-cb8fa.appspot.com",
  messagingSenderId: "464570700462",
  appId: "1:464570700462:web:b9cd09ce188da9c1",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export default storage;
