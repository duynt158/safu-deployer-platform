import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Login from '../components/Login/Login';
import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';

class LoginPage extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Login />
                <ModalSearch />
                <ModalMenu />
            </div>
        );
    }
}

export default LoginPage;