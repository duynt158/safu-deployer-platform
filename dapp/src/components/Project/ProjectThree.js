import React, { Component } from 'react';

const initData = {
    sub_heading: "Exclusive",
    heading: "Ongoing IGOs",
    btn: "View Leaderboard",
}

const data = [
    {
        id: "1",
        img: "/img/thumb_6.png",
        blockchain: "/img/ethereum.png",
        title: "Ancient Kingdom",
        price: "Price (GAC) = 0.89 BUSD",
        publish: "5 hours ago",
        process: "x86",
        amount: "$1.06298"
    },
    {
        id: "2",
        img: "/img/thumb_7.png",
        blockchain: "/img/binance.png",
        title: "Galaxy War",
        price: "Price (GAC) = 0.72 BUSD",
        publish: "7 hours ago",
        process: "x97",
        amount: "$0.9268"
    },
    {
        id: "3",
        img: "/img/thumb_8.png",
        blockchain: "/img/solana.png",
        title: "Crypto Art",
        price: "Price (GAC) = 0.68 BUSD",
        publish: "9 hours ago",
        process: "x64",
        amount: "$2.87641"
    },
    {
        id: "4",
        img: "/img/thumb_9.png",
        blockchain: "/img/ethereum-gold.png",
        title: "Marvel Design",
        price: "Price (GAC) = 0.49 BUSD",
        publish: "6 hours ago",
        process: "x75",
        amount: "$1.5967"
    },
    {
        id: "5",
        img: "/img/thumb_10.png",
        blockchain: "/img/ethereum.png",
        title: "Partial Monk",
        price: "Price (GAC) = 0.78 BUSD",
        publish: "9 hours ago",
        process: "x94",
        amount: "$0.43615"
    }
]

class ProjectThree extends Component {
    state = {
        initData: {},
        data: []
    }
    componentDidMount(){
        this.setState({
            initData: initData,
            data: data
        });
    }
    render() {
        return (
            <section className="explore-area prev-project-area">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {/* Intro */}
                            <div className="intro d-flex justify-content-between align-items-end m-0">
                            <div className="intro-content">
                                <span className="intro-text">{this.state.initData.sub_heading}</span>
                                <h3 className="mt-3 mb-0">{this.state.initData.heading}</h3>
                            </div>
                            <div className="intro-btn">
                                <a className="btn content-btn" href="/leaderboard">{this.state.initData.btn}</a>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="row items">
                        {this.state.data.map((item, idx) => {
                            return (
                                <div key={`pdt_${idx}`} className="col-12 item">
                                    <div className="card project-card prev-project-card">
                                        <div className="project-content d-md-flex flex-column flex-md-row align-items-center justify-content-md-between">
                                            <div className="item-header d-flex align-items-center mb-4 mb-md-0">
                                                <img className="card-img-top avatar-max-lg" src={item.img} alt="" />
                                                <div className="content ml-4">
                                                    <h4 className="m-0">{item.title}</h4>
                                                    <h6 className="mt-3 mb-0">{item.price}</h6>
                                                </div>
                                            </div>
                                            <div className="blockchain d-inline-block mr-1 mr-md-0">
                                                <img src={item.blockchain} alt="" />
                                            </div>
                                            <div className="single-item">
                                                <span>{item.publish}</span>
                                            </div>
                                            <div className="single-item d-none d-md-inline-block">
                                                <span>{item.process}</span>
                                            </div>
                                            <div className="single-item">
                                                <span>ATH:</span>
                                                <span>{item.amount}</span>
                                            </div>
                                        </div>
                                        <a className="project-link" href="/project-single" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div class="row mt-4 mt-md-5">
                        <div class="col-12">
                            <nav>
                                <ul class='page-numbers'>
                                    <li><span aria-current="page" class="page-numbers current">1</span></li>
                                    <li><a class="page-numbers" href="#">2</a></li>
                                    <li><span class="page-numbers dots">&hellip;</span></li>
                                    <li><a class="page-numbers" href="#">4</a></li>
                                    <li><a class="next page-numbers" href="#"><i class="icon-arrow-right"></i></a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default ProjectThree;