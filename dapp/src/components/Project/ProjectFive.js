import React, { Component } from 'react';

const initData = {
    sub_heading: "Project",
    heading: "Upcoming IGOs",
    btn: "View Tier System",
    actionBtn: "Participate"
}

const data = [
    {
        id: "1",
        img: "/img/thumb_1.png",
        blockchain: "/img/ethereum.png",
        title: "Metaverse 3D",
        reg_date: "2022-12-30",
        raise: "100k",
        val: "2.8M",
        allocation: "$0",
        progress: "25%",
        mecha: "0/100,069 MECHA",
        busd: "0 BUSD"
    },
    {
        id: "2",
        img: "/img/thumb_2.png",
        blockchain: "/img/binance.png",
        title: "Pixel Pix",
        reg_date: "2022-11-25",
        raise: "85k",
        val: "1.9M",
        allocation: "$0",
        progress: "8%",
        mecha: "0/94,752 MECHA",
        busd: "0 BUSD"
    },
    {
        id: "3",
        img: "/img/thumb_3.png",
        blockchain: "/img/ethereum-gold.png",
        title: "Cyber City",
        reg_date: "2022-11-18",
        raise: "69k",
        val: "3.2M",
        allocation: "$0",
        progress: "12%",
        mecha: "0/87,074 MECHA",
        busd: "0 BUSD"
    },
    {
        id: "4",
        img: "/img/thumb_4.png",
        blockchain: "/img/solana.png",
        title: "Real Hunter",
        reg_date: "2022-12-28",
        raise: "90k",
        val: "2.6M",
        allocation: "$0",
        progress: "27%",
        mecha: "0/532,399 MECHA",
        busd: "0 BUSD"
    },
    {
        id: "5",
        img: "/img/thumb_5.png",
        blockchain: "/img/ethereum-gold.png",
        title: "BitHotel",
        reg_date: "2022-10-30",
        raise: "120k",
        val: "4.8M",
        allocation: "$0",
        progress: "42%",
        mecha: "0/298,064 MECHA",
        busd: "0 BUSD"
    }
]

const socialData = [
    {
        id: "1",
        link: "twitter",
        icon: "fab fa-twitter"
    },
    {
        id: "2",
        link: "telegram",
        icon: "fab fa-telegram"
    },
    {
        id: "3",
        link: "globe",
        icon: "fas fa-globe"
    },
    {
        id: "4",
        link: "discord",
        icon: "fab fa-discord"
    }
]

class ProjectFive extends Component {
    state = {
        initData: {},
        data: [],
        socialData: []
    }
    componentDidMount(){
        this.setState({
            initData: initData,
            data: data,
            socialData: socialData
        });
    }
    render() {
        return (
            <section id="explore" className="project-area">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {/* Intro */}
                            <div className="intro d-flex justify-content-between align-items-end m-0">
                                <div className="intro-content">
                                    <span className="intro-text">{ this.state.initData.sub_heading }</span>
                                    <h3 className="mt-3 mb-0">{ this.state.initData.heading }</h3>
                                </div>
                                <div className="intro-btn">
                                    <a className="btn content-btn" href="/tier-system">{ this.state.initData.btn }</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="project-slides">
                        <div className="swiper-container slider-mid items">
                            <div className="swiper-wrapper">
                                {this.state.data.map((item, idx) => {
                                    return (
                                        <div key={`pd_${idx}`} className="swiper-slide item">
                                            <div className="card project-card">
                                                <div className="media">
                                                    <a href="/project-single">
                                                        <img className="card-img-top avatar-max-lg" src={ item.img } alt="" />
                                                    </a>
                                                    <div className="media-body ml-4">
                                                        <a href="/project-single">
                                                            <h4 className="m-0">{ item.title }</h4>
                                                        </a>
                                                        <div className="countdown-times">
                                                            <h6 className="my-2">Registration in:</h6>
                                                            <div className="countdown d-flex" data-date={ item.reg_date } />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Project Body */}
                                                <div className="card-body">
                                                    <div className="items">
                                                        {/* Single Item */}
                                                        <div className="single-item">
                                                            <span>Total raise</span>
                                                            <span> { item.raise }</span>
                                                        </div>
                                                        {/* Single Item */}
                                                        <div className="single-item">
                                                            <span>Valu</span>
                                                            <span> { item.val }</span>
                                                        </div>
                                                        {/* Single Item */}
                                                        <div className="single-item">
                                                            <span>Min allo</span>
                                                            <span> { item.allocation }</span>
                                                        </div>
                                                    </div>
                                                    <div className="item-progress">
                                                        <div className="progress mt-4 mt-md-5">
                                                            <div className="progress-bar" role="progressbar" style={{width: '25%'}} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>{ item.progress }</div>
                                                        </div>
                                                        <div className="progress-sale d-flex justify-content-between mt-3">
                                                            <span>{ item.mecha }</span>
                                                            <span>{ item.busd }</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Project Footer */}
                                                <div className="project-footer d-flex align-items-center mt-4 mt-md-5">
                                                    <a className="btn btn-bordered-white btn-smaller" href="/project-single">{ this.state.initData.actionBtn }</a>
                                                    {/* Social Share */}
                                                    <div className="social-share ml-auto">
                                                        <ul className="d-flex list-unstyled">
                                                            {this.state.socialData.map((item, idx) => {
                                                                return (
                                                                    <li key={`sd_${idx}`}>
                                                                        <a href="/#">
                                                                            <i className={ item.icon } />
                                                                        </a>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                                {/* Blockchain Icon */}
                                                <div className="blockchain-icon">
                                                    <img src={ item.blockchain } alt="" />
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
}

export default ProjectFive;