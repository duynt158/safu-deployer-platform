import React from 'react';

import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Project from '../components/Project/ProjectOne';
import ProjectTwo from '../components/Project/ProjectTwo';
import Content from '../components/Content/Content';
// import Team from '../components/Team/Team';
// import Work from '../components/Work/Work';
// import Cta from '../components/Cta/Cta';
import Footer from '../components/Footer/Footer';
// import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';

const ThemeOne = () => {
    return (
        <div className="main">
            <Header />
            <Hero />
            <Project />
            <ProjectTwo />
            <Content />
            {/* <Team /> */}
            {/* <Work /> */}
            {/* <Cta /> */}
            <Footer />
            {/* <ModalSearch /> */}
            <ModalMenu />
        </div>
    )
}

export default ThemeOne;