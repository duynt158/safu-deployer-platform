import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import BlogSingle from '../components/BlogSingle/BlogSingle';
import Footer from '../components/Footer/Footer';
import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';

class BlogSinglePage extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Breadcrumb title="Blog Single" subpage="Community" page="Blog Single" />
                <BlogSingle />
                <Footer />
                <ModalSearch />
                <ModalMenu />
            </div>
        );
    }
}

export default BlogSinglePage;