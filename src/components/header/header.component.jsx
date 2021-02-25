import React from 'react';

import './header.styles.css'

export const Header = () => {
    return (
        <header className="bg-gradient">
            <div className="img-holder">
                <img src="/images/breathing-ball.webp" alt="air bubble" className="img-fluid" />
            </div>
            <div className="container mt-5 pb-5 title">
                <h1>The missing pillar in health is breath</h1>
                <p className="tagline mt-5">
                    no matter what we eat<br />
                how much we exercise<br />
                how resilient our genes are<br />
                how skinny or young or wise we are<br />
                    <b>none</b> of it will matter unless<br />
                    <b> we're breathing correctly</b>
                </p>
            </div>
        </header>
    )
}