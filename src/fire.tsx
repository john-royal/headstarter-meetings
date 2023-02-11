import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {

    apiKey: "AIzaSyAP9HuIseo2rBSjUJRRo9ZUxpeYpXVXn6E",

    authDomain: "headstarter-meetings.firebaseapp.com",
  
    projectId: "headstarter-meetings",
  
    storageBucket: "headstarter-meetings.appspot.com",
  
    messagingSenderId: "649435729664",
  
    appId: "1:649435729664:web:dfdef188a6439b0f182de5",
  
    measurementId: "G-Z3PQWPMRNC"
  
  
  };
  
  
  // Initialize Firebase
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  export default auth;