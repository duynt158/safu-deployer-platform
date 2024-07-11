import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Farm from '../components/Farming/Farming';
import Cta from '../components/Cta/Cta';
import Footer from '../components/Footer/Footer';
import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';

class Farming extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Breadcrumb title="Farming" subpage="Pages" page="Farming" />
                <Farm />
                <Cta />
                <Footer />
                <ModalSearch />
                <ModalMenu />
            </div>
        );
    }
}

export default Farming;