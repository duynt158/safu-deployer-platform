import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Wallet from '../components/Wallet/Wallet';
// import Cta from '../components/Cta/Cta';
import Footer from '../components/Footer/Footer';
// import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';

class WalletConnect extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Breadcrumb title="Connect Wallet" subpage="Pages" page="Connect Wallet" />
                <Wallet />
                {/* <Cta /> */}
                <Footer />
                {/* <ModalSearch /> */}
                <ModalMenu />
            </div>
        );
    }
}

export default WalletConnect;