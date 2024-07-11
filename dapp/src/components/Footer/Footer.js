import React, { useState } from 'react';

const Footer = () => {
    const [data] = useState({
        copyright: "©2023 KISS Deployer, All Rights Reserved By",
        img: "/img/logo.png",
        owner: "KISS Deployer Team",
        ownerLink: "#",
    })
    const [socialData] = useState([
        // {id: 1, link: 'https://www.facebook.com/', icon: 'icon-social-facebook'},
        {id: 2, link: 'https://twitter.com/kisserc20', icon: 'icon-social-twitter'},
        // {id: 3, link: 'https://www.linkedin.com/', icon: 'icon-social-linkedin'},
        // {id: 4, link: 'https://www.reddit.com/', icon: 'icon-social-reddit'},
        // {id: 5, link: 'https://discord.com/', icon: 'icon-social-vkontakte'},
        // {id: 6, link: 'https://www.youtube.com/', icon: 'icon-social-youtube'}
    ])
    const [widgetData] = useState([
        // {id: 1, text: 'Features', link: '#'},
        // {id: 2, text: 'Roadmap', link: '#'},
        // {id: 3, text: 'How It Works', link: '#'},
        // {id: 4, text: 'Blog', link: '#'},
        // {id: 5, text: 'Privacy Policy', link: '#'}
    ])

    return (
        <footer className="footer-area">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 text-center">
                        {/* Footer Items */}
                        <div className="footer-items">
                            {/* Logo */}
                            <a className="navbar-brand" href="/">
                                <img src={data.img} alt="" style={{maxWidth: '96px'}}/>
                            </a>
                            {/* Social Icons */}
                            <div className="social-icons d-flex justify-content-center my-4">
                                {socialData.map((item, idx) => {
                                    return (
                                        <a key={`fsd_${idx}`} className="facebook" href={item.link} target="_blank" rel="noreferrer">
                                            <i className={item.icon} />
                                            <i className={item.icon} />
                                        </a>
                                    );
                                })}
                            </div>
                            <ul className="list-inline">
                                {widgetData.map((item, idx) => {
                                    return (
                                        <li key={`fwd_${idx}`} className="list-inline-item"><a href={item.link} target="_blank" rel="noreferrer">{item.text}</a></li>
                                    );
                                })}
                            </ul>
                            {/* Copyright Area */}
                            <div className="copyright-area py-4">{data.copyright} <a href={data.ownerLink} target="_blank" rel="noreferrer">{data.owner}</a></div>
                        </div>
                        {/* Scroll To Top */}
                        <div id="scroll-to-top" className="scroll-to-top">
                            <a href="#header" className="smooth-anchor">
                                <i className="fa-solid fa-arrow-up" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;