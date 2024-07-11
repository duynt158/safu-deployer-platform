import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Tier from '../components/Tier/Tier';
import Cta from '../components/Cta/Cta';
import Footer from '../components/Footer/Footer';
import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';

class TierSystem extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Breadcrumb title="Tier System" subpage="Pages" page="Tier System" />
                <Tier />
                <Cta />
                <Footer />
                <ModalSearch />
                <ModalMenu />
            </div>
        );
    }
}

export default TierSystem;