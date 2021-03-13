import React from 'react';

import { withFirebase } from '../../firebase';
import './sign-out.styles.css'

const SignOutButton = ({ firebase }) => (
    <button className="btn-light" onClick={firebase.doSignOut}>
        Sign Out
    </button>
);

export default withFirebase(SignOutButton);