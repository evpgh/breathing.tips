import React from 'react';
import './reset.css';
import './homepage.styles.css';
import { Navbar } from './../navbar/navbar.component';
import { Header } from './../header/header.component';
import { Footer } from './../footer/footer.component';
import { Socialbar } from './../social/socialbar.component';
import { Quote } from './../quote/quote.component';
import TipsList from './../tipslist/tipslist.component';

export const Homepage = () => {
    return (
        <div>
            <Navbar />
            <Header />
            <TipsList />
            <Quote />
            <Socialbar />
            <Footer />
        </div>
    )
}