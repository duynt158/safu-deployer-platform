import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Register from '../components/Register/Register';
import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';

class RegisterPage extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Register />
                <ModalSearch />
                <ModalMenu />
            </div>
        );
    }
}

export default RegisterPage;