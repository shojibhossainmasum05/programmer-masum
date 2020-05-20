import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.Config';

firebase.initializeApp(firebaseConfig);

function App() {

  const {user, setUser} = useState
  ({
        isSignedIn: false,
        name : '',
        email : '',
        photo : ''
  });

  const provider = new firebase.auth.GoogleAuthProvider();
    const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(result => {
    const {photoURL, displayName, email} = result;

  const signedInUser =
  {
        isSignedIn : true,
        name: displayName,
        email: email,
        photo: photoURL
  }

  setUser(signedInUser);
  })
  
      .catch(error => {
      console.log(error);
      console.log(error.message);
  })

}

  return (
    <div className="App">
    <button onClick={handleSignIn}> Sign In </button>
    {
        user.isSignedIn && 
      <div>
        <p> welcome, {user.name} </p>
        <p> Your E-mail :  {user.email} </p>
        <img src = {user.photo} alt=""> </img>
      </div>
    }
    </div>
  );
}

export default App;
