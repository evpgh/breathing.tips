import React from 'react';
import './script.js';
import './navbar.styles.css';
import '@pwabuilder/pwainstall'
import * as Panelbear from "@panelbear/panelbear-js";

class Navbar extends React.Component {
    share() {
        Panelbear.track("share")
        const shareData = {
            title: 'breathing.tips',
            text: 'experience breathing correctly',
            url: 'https://breathing.tips',
        }
        if (window.navigator.share) {
            navigator.share(shareData).then(Panelbear.track("share-success"))
        }
    }

    render() {
        return (
            <div className="nav-menu" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <nav className="navbar navbar-dark navbar-expand-sm  d-block d-md-none">
                                <a className="navbar-brand d-none d-md-block d-xl-block" href="index.html">breathing.tips</a>
                                <div id="navbar">
                                    <ul className="navbar-nav d-flex justify-content-center">
                                        <li className="nav-item mx-auto"><a onClick={Panelbear.track("-routine")} href="#routine" className="nav-link">ROUTINE</a></li>
                                        <li className="nav-item mx-auto"><a onClick={Panelbear.track("-discover")} href="#discover" className="nav-link">DISCOVER</a></li>
                                        <li className="nav-item mx-auto d-md-none"> <a onClick={this.share()} href="#share" className="nav-link">SHARE</a> </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export { Navbar };