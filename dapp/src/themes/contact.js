import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';
import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';

class ContactPage extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Breadcrumb title="Contact Us" subpage="Pages" page="Contact" />
                <Contact />
                <Footer />
                <ModalSearch />
                <ModalMenu />
            </div>
        );
    }
}

export default ContactPage;