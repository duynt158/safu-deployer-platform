import React, { useState } from 'react';
import { Link } from 'react-router-dom'

const tInitData = {
    sub_heading: "Creative",
    heading: "Our Team",
    btn: "View Leaderboard"
}

const tData = [
    {
        id: "1",
        img: "/img/team_1.png",
        name: "Minh Nguyen",
        designation: "CEO"
    },
    {
        id: "2",
        img: "/img/team_2.png",
        name: "John Doe",
        designation: "Advisor"
    },
    {
        id: "3",
        img: "/img/team_3.png",
        name: "John Avery",
        designation: "CTO"
    },
    {
        id: "4",
        img: "/img/team_4.png",
        name: "Junaid Hasan",
        designation: "CMO"
    },
    {
        id: "5",
        img: "/img/team_5.png",
        name: "Arham Hasan",
        designation: "Developer"
    }
]

const tSocialData = [
    {
        id: "1",
        icon: "icon-social-facebook"
    },
    {
        id: "2",
        icon: "icon-social-twitter"
    },
    {
        id: "3",
        icon: "icon-social-linkedin"
    },
    {
        id: "4",
        icon: "icon-social-reddit"
    }
]

const Team = () => {
    const [initData, setInitData] = useState(tInitData)
    const [data, setData] = useState(tData)
    const [socialData, setSocialData] = useState(tSocialData)

    return (
        <section className="team-area p-0">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {/* Intro */}
                        <div className="intro d-flex justify-content-between align-items-end m-0">
                        <div className="intro-content">
                            <span className="intro-text">{initData.sub_heading}</span>
                            <h3 className="mt-3 mb-0">{initData.heading}</h3>
                        </div>
                        <div className="intro-btn">
                            <Link className="btn content-btn" to="#">{initData.btn}</Link>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="team-slides">
                    <div className="swiper-container slider-min items">
                        <div className="swiper-wrapper">
                            {/* Single Slide */}
                            {data.map((item, idx) => {
                                return (
                                    <div key={`td_${idx}`} className="swiper-slide item">
                                        {/* Team Card */}
                                        <div className="card team-card text-center">
                                        <a className="team-photo d-inline-block" href="#">
                                            <img className="mx-auto" src={item.img} alt="" />
                                        </a>
                                        {/* Team Content */}
                                        <div className="team-content mt-3">
                                            <a href="#">
                                            <h4 className="mb-0">{item.name}</h4>
                                            </a>
                                            <span className="d-inline-block mt-2 mb-3">{item.designation}</span>
                                            {/* Social Share */}
                                            <div className="social-share">
                                                <ul className="d-flex justify-content-center list-unstyled">
                                                    {socialData.map((item, idx) => {
                                                        return (
                                                            <li key={`sd_${idx}`}>
                                                                <a href="/#">
                                                                    <i className={item.icon} />
                                                                </a>
                                                            </li>   
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="swiper-pagination" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Team;