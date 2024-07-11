import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Blog from '../components/Blog/Blog';
import Footer from '../components/Footer/Footer';
import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';

class BlogPage extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Breadcrumb title="Blog" subpage="Community" page="Blog" />
                <Blog />
                <Footer />
                <ModalSearch />
                <ModalMenu />
            </div>
        );
    }
}

export default BlogPage;