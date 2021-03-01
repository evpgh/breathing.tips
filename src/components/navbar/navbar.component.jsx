import React from 'react';
import './script.js';
import './navbar.styles.css';
import '@pwabuilder/pwainstall'
import * as Panelbear from "@panelbear/panelbear-js";

class Navbar extends React.Component {
    componentDidMount() {
        var ref = document.getElementById("installComponent");
        ref.getInstalledStatus();
    }

    share() {
        Panelbear.track("-share")
        const shareData = {
            title: 'breathing.tips',
            text: 'TOP 5 breathing exercises',
            url: 'https://breathing.tips',
        }
        if (navigator.canShare) {
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
                                        <li className="nav-item mx-auto"><a onClick={Panelbear.track("-exercises")} href="#exercises" className="nav-link">PRACTICE</a></li>
                                        <li className="nav-item mx-auto"> <a onClick={Panelbear.track("-pwa-install")} href="/" className="nav-link"><pwa-install id="installComponent">INSTALL</pwa-install></a> </li>
                                        <li className="nav-item mx-auto"> <a onClick={this.share} className="nav-link" href="#social">SHARE</a> </li>
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