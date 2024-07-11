import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Tokenomic from '../components/Tokenomics/Tokenomics';
import Cta from '../components/Cta/Cta';
import Footer from '../components/Footer/Footer';
import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';

class Tokenomics extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Breadcrumb title="Token Distribution" subpage="Pages" page="Tokenomics" />
                <Tokenomic />
                <Cta />
                <Footer />
                <ModalSearch />
                <ModalMenu />
            </div>
        );
    }
}

export default Tokenomics;