import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { uiConfig } from '../../firebase/firebase.utils'
import { withRouter } from 'react-router-dom';
import './sign-in.styles.scss';
import { FirebaseContext, withFirebase } from '../../firebase';
import { compose } from 'recompose';


const SignInComponent = () => (
    <div className='sign-in'>
        <FirebaseContext.Consumer>
            {firebase => <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth} />}
        </FirebaseContext.Consumer>
    </div>
)

const SignIn = compose(
    withRouter,
    withFirebase
)(SignInComponent);

export default SignIn;
export { SignIn }