import React from 'react';
import Button from 'react-bootstrap/Button';
import { AuthUserContext, withAuthentication } from '../../session';
import SignInModal from '../sign-in/join-modal.component'

function ComingSoonButton(props) {
    return (
        <Button variant="primary" disabled>
            COMING SOON
        </Button>
    );
}

const LoginControl = (props) => (
    <div>
        <AuthUserContext.Consumer>
            {currentUser =>
                currentUser ? <ComingSoonButton /> : <SignInModal buttonType="primary" buttonText="SIGN UP" className="dropdown-item" onClick={props.onClick} />
            }
        </AuthUserContext.Consumer>
    </div>
)

export default withAuthentication(LoginControl);