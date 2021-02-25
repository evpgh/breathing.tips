import React from 'react';
import DOMPurify from 'dompurify';

import './tipslist.styles.css'

class TipsList extends React.Component {
    constructor() {
        super();

        this.state = {
            tips: []
        };
    }

    componentDidMount() {
        fetch('/tips.json')
            .then(response => response.json())
            .then(tips => this.setState({ tips: tips }))
    }

    render() {
        return (
            <div className="container Features mb-5 d-flex col-md-4 col-8  justify-content-center">
                <a className="mx-auto mt-5 mb-5" href="#exercises">PRACTICE NOW</a>
                <h2 id="exercises" className="mx-auto mb-4 text-center"> top 5 breathing exercises</h2>

                {this.state.tips.map(tip => (
                    <div className="card row mt-4 mb-4" key={tip.id}>
                        <div className="card-body">
                            <a href={"/practice/" + tip.url} className="exercise-link">
                                <h3 className="card-title">
                                    {tip.name}
                                    <svg height="50" width="50">
                                        <circle cx="23" cy="23" r="23" fill="#FCDDEB" />
                                        <polygon points="15,10 15,35 35,22" strokeLinejoin="round" fill="white" />
                                    </svg>
                                </h3>
                            </a>
                            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tip.description) }} />
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

export default TipsList;