import React from 'react';
import './navbar.styles.css';
import '@pwabuilder/pwainstall'
import * as Panelbear from "@panelbear/panelbear-js";
import { AuthUserContext, withAuthentication } from '../../session';
import SignOutButton from '../sign-out/sign-out.component'
import SignInModal from '../sign-in/join-modal.component'

const NavigationLoggedOut = () => (
    <div className="container">
        <nav className="navbar navbar-dark navbar-expand justify-content-end">
            <a routerLink="/" class="navbar-brand" href="#">breathing.tips</a>
            <ul className="navbar-nav">
                <li className="nav-item"><a onClick={Panelbear.track("-routine")} href="#routine" className="nav-link">ROUTINE</a></li>
                <li className="nav-item"><a onClick={Panelbear.track("-discover")} href="#discover" className="nav-link">DISCOVER</a></li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        JOIN
            </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <SignInModal buttonText="SIGN UP" className="dropdown-item" />
                        <SignInModal className="dropdown-item" />
                    </div>
                </li>
            </ul>
        </nav>
    </div>
)

const NavigationLoggedIn = ({ currentUser }) => (
    <div className="container">
        <nav className="navbar navbar-dark navbar-expand justify-content-end">
            <a routerLink="/" class="navbar-brand" href="#">breathing.tips</a>
            <ul className="navbar-nav">
                <li className="nav-item"><a onClick={Panelbear.track("-routine")} href="#routine" className="nav-link">ROUTINE</a></li>
                <li className="nav-item"><a onClick={Panelbear.track("-discover")} href="#discover" className="nav-link">DISCOVER</a></li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {currentUser.displayName}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <SignOutButton />
                    </div>
                </li>
            </ul>
        </nav>
    </div>
)

const Navbar = ({ currentUser }) => (
    <AuthUserContext.Consumer>
        {currentUser =>
            currentUser ? <NavigationLoggedIn currentUser={currentUser} /> : <NavigationLoggedOut />
        }
    </AuthUserContext.Consumer >
)

export default withAuthentication(Navbar)