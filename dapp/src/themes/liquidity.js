import React from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Board from '../components/Liquidity/Liquidity';
// import Cta from '../components/Cta/Cta';
import Footer from '../components/Footer/Footer';
// import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';
import { useParams } from 'react-router';

const Liquidity = () => {
    const { token } = useParams()

    return (
        <div className="main">
            <Header />
            <Breadcrumb title="Liquidity" subpage="Token" page={token} />
            <Board token={token} />
            {/* <Cta /> */}
            <Footer />
            {/* <ModalSearch /> */}
            <ModalMenu />
        </div>
    )
}

export default Liquidity;