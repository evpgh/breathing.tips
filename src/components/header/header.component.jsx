import React from 'react';
import './header.styles.css'

export const Header = () => {
    return (
        <div className="container bg-gradient border-radius-bottom">
            <header>
                <div className="container pb-5 title">
                    <h1>experience</h1>
                    <h2>breathing correctly</h2>
                </div>
                <div className="img-holder text-center">
                    <img src="/images/whifflet-10.png" alt="air bubble" className="img-fluid" />
                </div>
            </header>
        </div>
    )
}