import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useHistory, Redirect } from 'react-router-dom'


// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// ui.start('#firebaseui-auth-container', uiConfig);


const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

export const uiConfig = {
  signInOptions:[
    app.auth.GoogleAuthProvider.PROVIDER_ID,
    app.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
  tosUrl: '/terms-of-service',
  privacyPolicyUrl: function() {
    window.location.assign('/privacy-policy')
  },
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      console.log("successful sign in");
      return false;
    },
  },
}

export const createUserProfileDocument = async(userAuth, additionalParams) => {
    if (!userAuth) return;

    const userRef = app.firestore.doc(`users/${userAuth.uid}`);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        try {
          await userRef.set({
            displayName,
            email,
            createdAt,
            ...additionalParams
          });
        } catch (error) {
          console.log('error creating user', error.message);
        }
      }
    
      return userRef;
}

export const createExperienceDocument = async(userId, additionalParams) => {
    var userRef = app.firestore.doc(`/users/${userId}`)
    try {
        await app.firestore.collection('experiences').add({
        userRef,
        ...additionalParams
        });
    } catch (error) {
        console.log('error saving experience', error.message);
    }
}

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
  }

  googleProvider = () => new app.auth.GoogleAuthProvider();
  facebookProvider = () => new app.auth.FacebookAuthProvider();

  signInWithGoogle = () => app.auth.signInWithRedirect(this.googleProvider());
  signInWithFacebook = () => app.auth.signInWithRedirect(this.facebookProvider());

  firestore = () => app.firestore();

  doSignOut = () => this.auth.signOut();
}

export default Firebase;
