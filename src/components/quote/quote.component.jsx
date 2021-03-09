import React from 'react';
import './quote.styles.css';

export const Quote = () => {
    return (
        <div className="section bg-gradient-light border-radius-top">
            <div className="col-lg-12 align-items-center text-center">
                <h3 className="pt-5 pb-5">The missing pillar in health is breath</h3>
                <p className="tagline pb-5">
                    no matter what we eat<br />
                            how much we exercise<br />
                            how resilient our genes are<br />
                            how skinny or young or wise we are<br />
                    <b>none</b> of it will matter unless<br />
                    <b> we're breathing correctly</b><br /><br />
                    <i>Breath - the science of a lost art</i> <br />
                    <i>by James Nestor</i>
                </p>
            </div>
        </div>
    )
}