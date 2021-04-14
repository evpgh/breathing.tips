import React from 'react';
import AuthUserContext from './context'
import { withFirebase } from './../firebase'
 
const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor() {
        super();
    
        this.state = {
          user: {
            currentUser: null
          }
        };
      }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            currentUser => {
              if (currentUser) {
                this.setState({ user: { currentUser: currentUser}})
              }
              else {
                this.setState({ user: { currentUser: null}})
              }
            },
          );
    }

    componentWillUnmount() {
        this.listener();
    }
    render() {
      return (
        <AuthUserContext.Provider value={this.state.user.currentUser}>
            <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }
 
  return withFirebase(WithAuthentication);
};
 
export default withAuthentication;