import React from 'react';
import './script.js';
import './navbar.styles.css';
import '@pwabuilder/pwainstall'

class Navbar extends React.Component {
    componentDidMount() {
        var ref = document.getElementById("installComponent");
        ref.getInstalledStatus();
    }

    render() {
        return (
            <div className="nav-menu" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <nav className="navbar navbar-dark navbar-expand-sm">
                                <a className="navbar-brand d-none d-md-block d-xl-block" href="index.html">breathing.tips</a>
                                <div id="navbar">
                                    <ul className="navbar-nav d-flex justify-content-center">
                                        <li className="nav-item mx-auto"><a href="#exercises" className="nav-link">PRACTICE</a></li>
                                        <li className="nav-item mx-auto"> <a className="nav-link"><pwa-install id="installComponent">INSTALL</pwa-install></a> </li>
                                        <li className="nav-item mx-auto"> <a className="nav-link" href="#social">SHARE</a> </li>
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