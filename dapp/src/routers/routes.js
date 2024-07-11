import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// importing all the themes
import ThemeOne from "../themes/theme-one";
// import ProjectOne from "../themes/project-one";
// import ProjectTwo from "../themes/project-two";
// import ProjectThree from "../themes/project-three";
// import ProjectFour from "../themes/project-four";
// import ProjectSingle from "../themes/project-single";
import TemplateOne from "../themes/template-one";
import TemplateTwo from "../themes/template-two";
import TemplateSearch from "../themes/template-search";
// import Farming from "../themes/farming";
import Liquidity from "../themes/liquidity";
import Locker from "../themes/locker";
// import Apply from "../themes/apply";
import Wallet from "../themes/wallet-connect";
// import HelpCenter from "../themes/help-center";
// import Contact from "../themes/contact";
// import Login from "../themes/login";
// import Register from "../themes/register";
// import Reset from "../themes/reset";
// import Tokenomics from "../themes/tokenomics";
// import Tier from "../themes/tier-system";
// import Blog from "../themes/blog";
// import BlogSingle from "../themes/blog-single";

import ToastListener from '../components/Toast'

class MyRouts extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={ <ThemeOne/> } />
            <Route exact path="/search" element={ <TemplateSearch/> } />
            <Route exact path="/search/:token" element={ <TemplateSearch/> } />
            {/* <Route exact path="/project-one" element={ <ProjectOne /> } />
            <Route exact path="/project-two" element={ <ProjectTwo /> } />
            <Route exact path="/project-three" element={ <ProjectThree /> } />
            <Route exact path="/project-four" element={ <ProjectFour /> } />
            <Route exact path="/project-single" element={ <ProjectSingle /> } /> */}
            <Route exact path="/template-one" element={ <TemplateOne/> } />
            <Route exact path="/template-two" element={ <TemplateTwo/> } />
            {/* <Route exact path="/farming" element={ <Farming /> } /> */}
            <Route exact path="/liquidity/:token" element={ <Liquidity/> } />
            <Route exact path="/locker" element={ <Locker/> } />
            <Route exact path="/locker/:token" element={ <Locker/> } />
            {/* <Route exact path="/apply" element={ <Apply /> } /> */}
            <Route exact path="/connect-wallet" element={ <Wallet /> } />
            {/* <Route exact path="/help-center" element={ <HelpCenter /> } /> */}
            {/* <Route exact path="/contact" element={ <Contact /> } /> */}
            {/* <Route exact path="/login" element={ <Login /> } />
            <Route exact path="/register" element={ <Register /> } />
            <Route exact path="/reset" element={ <Reset /> } />
            <Route exact path="/tokenomics" element={ <Tokenomics /> } />
            <Route exact path="/tier-system" element={ <Tier /> } />
            <Route exact path="/blog" element={ <Blog /> } />
            <Route exact path="/blog-single" element={ <BlogSingle /> } /> */}
          </Routes>
        </BrowserRouter>
        <ToastListener />
      </div>
    );
  }
}
export default MyRouts;