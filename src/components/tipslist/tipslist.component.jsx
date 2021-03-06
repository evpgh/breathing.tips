import React from 'react';
import DOMPurify from 'dompurify';

import './tipslist.styles.css'
import { Link } from 'react-router-dom';

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
            <div>
                <div className="container Features mb-5 d-flex col-lg-6 col-10  justify-content-center">
                    <a href="/#tips" className="CTA">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
                        </svg>
                        GET STARTED
                    </a>
                    {/* <a className="mx-auto mt-5 mb-5" href="#exercises">PRACTICE NOW</a>
                <h2 id="exercises" className="mx-auto mb-4 text-center"> top 5 breathing exercises</h2> */}
                    <div>
                        <span id="tips"></span>
                        {this.state.tips.map(tip => (
                            <div className="card row mt-4 mb-4" key={tip.id}>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <Link to={"/practice/" + tip.url}>
                                            {tip.name}
                                            <svg height="50" width="50">
                                                <circle cx="23" cy="23" r="23" fill="#4e71f9" />
                                                <polygon points="15,10 15,35 35,22" strokeLinejoin="round" fill="white" />
                                            </svg>
                                        </Link>
                                    </h5>
                                    <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tip.description) }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default TipsList;