import React, { useState, useEffect } from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Template from '../components/Template/TemplateSearch';
// import Cta from '../components/Cta/Cta';
import Footer from '../components/Footer/Footer';
// import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';
import { useParams } from 'react-router';

const TemplateSearch = () => {
    const { token } = useParams()
    const [shortToken, setShortToken] = useState('Token...')

    useEffect(() => {
        if (token && token.length >= 12) {
            setShortToken(token.slice(0, 6) + '...' + token.slice(-4))
        }
    }, [token])
    
    return (
        <div className="main">
            <Header />
            <Breadcrumb title={shortToken} subpage="Search" page={token ?? shortToken} />
            <Template token={token}/>
            {/* <Cta /> */}
            <Footer />
            {/* <ModalSearch /> */}
            <ModalMenu />
        </div>
    );
}

export default TemplateSearch;