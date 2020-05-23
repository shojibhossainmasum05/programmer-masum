import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.Config';
import 'bootstrap/dist/css/bootstrap.css';

firebase.initializeApp(firebaseConfig)
function App() {

  const [user, setUser] = useState
  ({
        isSignedIn: false,
        name : '',
        email : '',
        photo : '',
        password : '',
        isValid : false
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  // This is the Sign In button
    const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(result => {
    const {photoURL, displayName, email} = result.user;
    console.log(result);
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
  // This is the Sign Out button
const handleSignOut = () => {
  firebase.auth().signOut()
  .then(result => {
    console.log(result);
  const SignedOutUser = {
      isSignedIn : false,
      name : '',
      photo : '',
      email : '',
      error : '',
      isValid : false,
      existingUser : false
  }
  setUser(SignedOutUser);
  })
    .catch(error => 
    {
    console.log(error);
    console.log(error.message);
    })
}

const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
const hasNumber = input => /\d/.test(input);
const switchFrom = event => {
const createdUser = {...user};
createdUser.existingUser = event.target.checked;
setUser(createdUser);
}
const handleChange = e => {
const newUserInfo = {
    ...user
  };

let isValid = true;
  if (e.target.name === 'email')
{
  isValid = is_valid_email(e.target.value); 
  // console.log(is_valid_email(e.target.value));
}
  if (e.target.name === "password") 
{
  isValid = e.target.value.length > 8 && hasNumber(e.target.value);
  // console.log(hasNumber(e.target.value));
}
newUserInfo[e.target.name] = e.target.value;
newUserInfo.isValid = isValid;
setUser(newUserInfo);
}
const handleSignUp = (event) => {
 if (user.isValid) 
 {
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(res => {
    console.log(res);
  const createdUser = {...user};
  createdUser.isSignedIn = true;
  createdUser.error = '';
  setUser(createdUser);
  })
  .catch(error => {
    console.log(error.message);
    const createdUser = {...user};
    createdUser.error = error.message;
    createdUser.isSignedIn = false;
    setUser(createdUser);
  })
  console.log("Your Name : " + user.name +"Your Email : " + user.email + "Your Password : " + user.password);
 } 
//  else
//  {
//   console.log('Please try again');
//  }
 event.preventDefault();
 event.target.reset();
}

const signInUser = event => {
  if (user.isValid) 
 {
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res => {
    console.log(res);
  const createdUser = {...user};
  createdUser.isSignedIn = true;
  createdUser.error = '';
  setUser(createdUser);
  })
  .catch(error => {
    console.log(error.message);
    const createdUser = {...user};
    createdUser.error = error.message;
    createdUser.isSignedIn = false;
    setUser(createdUser);
  })
 }
  event.preventDefault();
  event.target.reset();

  document.querySelector('.img__btn').addEventListener('click', function() {
    document.querySelector('.cont').classList.toggle('s--signup');
  });
  
};

  return (
    <div className="App">
    { user.isSignedIn ? <button className="btn btn-danger" onClick={handleSignOut}> Sign Out </button> :
      <button className="btn btn-warning" onClick={handleSignIn}> Google Sign In </button>
    }
    {
        user.isSignedIn &&
        <div>
        <p> welcome, {user.name} </p>
        <p> Your E-mail :  {user.email} </p>
        <img src={user.photo} alt=""/> 
        </div>
    }
      <div>
          <h2 className="text-primary"> Facebook Account </h2>
          <input type="checkbox" name="switchFrom" onChange={switchFrom} id="switchFrom"/>
          <label htmlFor="">  Returning User </label>
        <form style={{display:user.existingUser ? 'block':'none'}} onSubmit={signInUser}>
          <input type="text" name="email" onChange={handleChange} placeholder=" Email " required/>
          <br/>
          <input type="text" name="password" onChange={handleChange} placeholder=" Password " required/>
          <br/>
          <br/>
          <input className="btn btn-primary" type="submit" value=" Sign In"/>
        </form>
        <form style={{display:user.existingUser ? 'none':'block'}} onSubmit={handleSignUp}>
          <input type="text" name="name" onChange={handleChange} placeholder=" Name " required/>
          <br/>
          <input type="text" name="email" onChange={handleChange} placeholder=" Email" required/>
          <br/>
          <input type="text" name="password" onChange={handleChange} placeholder=" Password " required/>
          <br/>
          <br/>
          <input className='btn btn-primary' type="submit" value="Sign Up"/>
        </form>
        { 
          user.error && <p className="error"> {user.error} </p>
        }
      </div>
    </div>
  );
}

export default App;
