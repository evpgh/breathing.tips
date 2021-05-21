import React from 'react';
import './reset.css';
import './homepage.styles.css';
import Navbar from './../navbar/navbar.component';
import { Header } from './../header/header.component';
import { Footer } from './../footer/footer.component';
import { Quote } from './../quote/quote.component';
import TipsList from './../tipslist/tipslist.component';
import * as Panelbear from "@panelbear/panelbear-js";

export const Homepage = () => {
    Panelbear.trackPageview();
    return (
        <div>
            <Navbar />
            <Header />
            <TipsList />
            <Footer />
        </div>
    )
}