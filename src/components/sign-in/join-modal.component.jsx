import React from 'react';

import Modal from "react-bootstrap/Modal";

import SignIn from './sign-in.component';
import './join-modal.styles.scss';

class JoinModal extends React.Component {
    constructor(props) {
        super();

        this.state = {
            modalOpen: false,
            buttonText: props.buttonText,
            buttonType: props.buttonType
        };
    }

    openModal = () => this.setState({ modalOpen: true });
    closeModal = () => this.setState({ modalOpen: false });
    toggleOpen = () => this.setState({ modalOpen: !this.state.modalOpen })

    render() {
        return (
            <div>
                <JoinButton buttonType={this.state.buttonType} buttonText={this.state.buttonText} onClick={this.toggleOpen} />
                <Modal show={this.state.modalOpen} onHide={this.closeModal} className="text-center">
                    <Modal.Header>
                        <h2 className="text-center card-title">Join breathing.tips</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Create an account and practice breathing tips in the safe place of your dreams.</p>
                        <SignIn />
                    </Modal.Body>
                    <Modal.Footer>
                        <p> To make breathing.tips work, we log user data, but we never share it with third parties.</p>
                        <p> Click "Sign in" above to accept our Terms of Service</p>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default JoinModal;

const JoinButton = (props) => (
    <button className={"btn-" + (props.buttonType || "light")} onClick={props.onClick}>
        { props.buttonText || "SIGN IN"}
    </button>
);

export { JoinButton };


