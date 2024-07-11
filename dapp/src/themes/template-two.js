import React from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Template from '../components/Template/TemplateTwo';
// import Cta from '../components/Cta/Cta';
import Footer from '../components/Footer/Footer';
// import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';
import { useGlobal } from '../contexts/GlobalContext';

const TemplateTwo = () => {
    const { TemplateName } = useGlobal()

    return (
        <div className="main">
            <Header />
            <Breadcrumb title={TemplateName[1]} subpage="Deploy" page={TemplateName[1]} />
            <Template />
            {/* <Cta /> */}
            <Footer />
            {/* <ModalSearch /> */}
            <ModalMenu />
        </div>
    );
}

export default TemplateTwo;