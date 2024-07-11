import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import IGOApply from '../components/Apply/Apply';
import Cta from '../components/Cta/Cta';
import Footer from '../components/Footer/Footer';
import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';

class Apply extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Breadcrumb title="Apply for IGO" subpage="Pages" page="Apply for IGO" />
                <IGOApply />
                <Cta />
                <Footer />
                <ModalSearch />
                <ModalMenu />
            </div>
        );
    }
}

export default Apply;