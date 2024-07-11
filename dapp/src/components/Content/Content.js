import React, { useState } from 'react';

const Content = () => {
    const [data, setData] = useState({
        contentData: [
            {id: 1, icon: 'fa-brands fa-discord', featured: '', title: 'Choose Your Contract Template', content: "You should select a token template to deploy."},
            {id: 2, icon: 'fa-brands fa-hotjar', featured: 'featured', title: 'Connect Wallet', content: "You can deploy a token on Ethereum connecting to the wallet."},
            {id: 3, icon: 'fa-solid fa-rocket', featured: '', title: 'Deploy', content: "Let's go to the world of easy blockchain."}
        ],
        excerpt: "Join this platform to deploy a new token as you want. You can easily configure and manage tokens you deployed too.",
        heading: "KISS Deployer",
        sub_heading: "Project",
    })
    
    return (
        <section className="content-area">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-12 col-md-6">
                        <div className="content intro">
                        <span className="intro-text">{data.sub_heading}</span>
                        <h2>{data.heading}</h2>
                        <p>{data.excerpt}</p>
                        <ul className="list-unstyled items mt-5">
                            {data.contentData.map((item, idx) => {
                                return (
                                    <li key={`cd_${idx}`} className="item">
                                        {/* Content List */}
                                        <div className="content-list d-flex align-items-center">
                                            <div className="content-icon">
                                            <span className={item.featured}>
                                                <i className={item.icon} />
                                            </span>
                                            </div>
                                            <div className="content-body ml-4">
                                            <h3 className="m-0">{item.title}</h3>
                                            <p className="mt-3">{item.content}</p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        {/* Blockchain Animation */}
                        <div className="wrapper-animation d-none d-md-block">
                            <div className="blockchain-wrapper">
                                <div className="pyramid">
                                    <div className="square">
                                        <div className="triangle" />
                                        <div className="triangle" />
                                        <div className="triangle" />
                                        <div className="triangle" />
                                    </div>
                                </div>
                                <div className="pyramid inverse">
                                    <div className="square">
                                        <div className="triangle" />
                                        <div className="triangle" />
                                        <div className="triangle" />
                                        <div className="triangle" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Content;