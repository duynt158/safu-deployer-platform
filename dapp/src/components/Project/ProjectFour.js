import React, { Component } from 'react';

const initData = {
    sub_heading: "Exclusive",
    heading: "Multi-chain IGOs",
    content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum obcaecati dignissimos quae quo ad iste ipsum officiis deleniti asperiores sit.",
    actionBtn: "Participate",
    filter_1: "All",
    filter_2: "Ongoing",
    filter_3: "Upcoming",
    filter_4: "Ended IGO"
}

const data = [
    {
        id: "1",
        img: "/img/thumb_1.png",
        group: '["ongoing","ended"]',
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
        group: '["upcoming","ended"]',
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
        group: '["ongoing"]',
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
        group: '["ended","ongoing"]',
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
        group: '["ended","upcoming"]',
        blockchain: "/img/ethereum-gold.png",
        title: "BitHotel",
        reg_date: "2022-10-30",
        raise: "120k",
        val: "4.8M",
        allocation: "$0",
        progress: "42%",
        mecha: "0/298,064 MECHA",
        busd: "0 BUSD"
    },
    {
        id: "6",
        img: "/img/thumb_6.png",
        group: '["upcoming","ended"]',
        blockchain: "/img/ethereum.png",
        title: "CryptoPunk",
        reg_date: "2022-11-30",
        raise: "89k",
        val: "4.6M",
        allocation: "$0",
        progress: "64%",
        mecha: "0/396,074 MECHA",
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

class ProjectFour extends Component {
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
            <section className="project-area explore-area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-7">
                            {/* Intro */}
                            <div className="intro text-center">
                                <div className="intro-content">
                                    <span className="intro-text">{ this.state.initData.sub_heading }</span>
                                    <h3 className="mt-3 mb-0">{ this.state.initData.heading }</h3>
                                    <p>{ this.state.initData.content }</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center text-center">
                        <div className="col-12">
                            {/* Explore Menu */}
                            <div className="explore-menu btn-group btn-group-toggle flex-wrap justify-content-center text-center mb-md-4" data-toggle="buttons">
                                <label className="btn active d-table text-uppercase p-2">
                                    <input type="radio" defaultValue="all" defaultChecked className="explore-btn" />
                                    <span>{this.state.initData.filter_1}</span>
                                </label>
                                <label className="btn d-table text-uppercase p-2">
                                    <input type="radio" defaultValue="ongoing" className="explore-btn" />
                                    <span>{this.state.initData.filter_2}</span>
                                </label>
                                <label className="btn d-table text-uppercase p-2">
                                    <input type="radio" defaultValue="upcoming" className="explore-btn" />
                                    <span>{this.state.initData.filter_3}</span>
                                </label>
                                <label className="btn d-table text-uppercase p-2">
                                    <input type="radio" defaultValue="ended" className="explore-btn" />
                                    <span>{this.state.initData.filter_4}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row explore-items items inner">
                        {this.state.data.map((item, idx) => {
                            return (
                                <div key={`pd_${idx}`} className="col-12 col-md-6 col-lg-4 item explore-item" data-groups={item.group}>
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
                </div>
            </section>
        );
    }
}

export default ProjectFour;