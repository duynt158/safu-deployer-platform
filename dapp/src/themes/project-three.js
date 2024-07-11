import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Project from '../components/Project/ProjectFive';
import Cta from '../components/Cta/Cta';
import Footer from '../components/Footer/Footer';
import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';

class ProjectThree extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Breadcrumb title="Project Style 3" subpage="Project" page="Project Style 3" />
                <Project />
                <Cta />
                <Footer />
                <ModalSearch />
                <ModalMenu />
            </div>
        );
    }
}

export default ProjectThree;