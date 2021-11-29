import React from 'react';
import DOMPurify from 'dompurify';

import './tipslist.styles.css'
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ArrowDownIcon from '../icons/down/ArrowDownIcon.component';
import JoinModal from '../sign-in/join-modal.component';
import LoginControl from './coming-soon-button.component';
class TipsList extends React.Component {
    constructor() {
        super();

        this.state = {
            tips: [],
            signInOpen: false
        };

        this.routines = {
            tipsUrls: ["awake", "box-breathing", "relax"]
        }
    }

    componentDidMount() {
        fetch('/tips.json')
            .then(response => response.json())
            .then(tips => this.setState({ tips: tips }))
    }

    practice(url) {
        console.log(url)
        var path = "/practice/" + url
        this.props.history.push(path)
    }

    openModal = () => this.setState({ signInOpen: true });
    closeModal = () => this.setState({ signInOpen: false });

    render() {
        return (
            <div>
                <JoinModal show={this.state.signInOpen} close={this.closeModal} />
                <div className="Features mb-5 mt-5 col-xs-12">
                    <div className="text-center">
                        <a href="/#routine" className="GetStarted">
                            <ArrowDownIcon className="x3" />
                        </a>
                    </div>
                    <div>
                        <div className="container tight">
                            <div id="routine"><h2 className="ml-3"> daily routine </h2></div>
                            <ul className="horizontal-scroll no-scrollbar">
                                {this.state.tips.map(tip => (
                                    <div className={tip.url + " card mt-4 mb-4 gradient-fill" + (this.routines.tipsUrls.indexOf(tip.url) > -1 ? "" : " d-none")} key={tip.id}>
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                <Link to={"/practice/" + tip.url}>
                                                    {tip.name}
                                                </Link>
                                            </h5>
                                            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tip.description) }} />
                                            <Link to={"/practice/" + tip.url}><Button variant="primary">PRACTICE NOW</Button></Link>
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <div className="container tight">
                            <div id="discover"><h2 className="ml-3"> discover </h2></div>
                            <ul className="horizontal-scroll no-scrollbar">
                                {this.state.tips.map(tip => (
                                    <div className={tip.url + " card row mt-4 mb-4 gradient-fill" + (this.routines.tipsUrls.indexOf(tip.url) < 0 ? "" : " d-none")} key={tip.id}>
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                <Link to={"/practice/" + tip.url}>
                                                    {tip.name}
                                                </Link>
                                            </h5>
                                            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tip.description) }} />
                                            <Link to={"/practice/" + tip.url}><Button variant="primary">PRACTICE NOW</Button></Link>
                                        </div>
                                    </div>
                                ))}

                                <div className="custom card row mt-4 mb-4 gradient-fill" key="customize-card">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            <Link to={"/"}>
                                                Create Yours
                                            </Link>
                                        </h5>
                                        <p> Pick from variety of high quality environments and sounds. Fine tune each exercise according to your lung capacity or create a completely new one and share it with the world. <br /><br /> Sign up now and be the first to try it! </p>
                                        {/* <Button variant="primary" onClick={this.openModal}>SIGN UP</Button> */}
                                        <LoginControl onClick={this.openModal} />
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div >
                </div >
            </div >
        )
    }
}

export default TipsList;