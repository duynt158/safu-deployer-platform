import React from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Board from '../components/Liquidity/Locker';
// import Cta from '../components/Cta/Cta';
import Footer from '../components/Footer/Footer';
// import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';
import { useParams } from 'react-router';
import walletConfig from '../contexts/WalletContext/config';
import { useGlobal } from '../contexts/GlobalContext';

const Locker = () => {
    const { token } = useParams()
    const { chainId } = useGlobal()

    return (
        <div className="main">
            <Header />
            <Breadcrumb title="Locker" subpage={walletConfig[chainId].networkName} page="Locker" />
            <Board token={token} />
            {/* <Cta /> */}
            <Footer />
            {/* <ModalSearch /> */}
            <ModalMenu />
        </div>
    )
}

export default Locker