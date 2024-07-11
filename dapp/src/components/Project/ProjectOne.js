import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import OwlCarousel from "react-owl-carousel"
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

import { useContract } from '../../contexts/ContractContext';
import { useGlobal } from '../../contexts/GlobalContext';

import BN from 'bignumber.js'

const ProjectOne = () => {
    const [initData] = useState({
        sub_heading: "Template",
        heading: "Our Top Contract Templates",
        btn: "View More",
        actionBtn: "Deploy"
    })

    const { TemplateName, chainId } = useGlobal()

    const [showData, setShowData] = useState(true)

    const [data, setData] = useState([
        {
            id: 1,
            img: "/img/thumb_1.png",
            blockchain: "/img/ethereum.png",
            title: TemplateName[0],
            reg_date: "2023-01-17",
            raise: "Tokenomics",
            cost: "0 $ETH",
            progress: 0,
            mecha: "0/1,000 Launched",
            busd: "0 $ETH",
            link: '/template-one'
        },
        {
            id: 2,
            img: "/img/thumb_2.png",
            blockchain: "/img/ethereum.png",
            title: TemplateName[1],
            reg_date: "2023-01-17",
            raise: "Tokenomics",
            cost: "0 $ETH",
            progress: 0,
            mecha: "0/1,000 Launched",
            busd: "0 $ETH",
            link: '/template-two'
        },
        {
            id: 3,
            img: "/img/thumb_3.png",
            blockchain: "/img/ethereum.png",
            title: "Coming Soon",
            reg_date: "2023-02-02",
            raise: "Tokenomics",
            cost: "0 $ETH",
            progress: 0,
            mecha: "0/1,000 Launched",
            busd: "0 $ETH",
            link: ''
        }
    ])
    const [socialData] = useState([
        // {
        //     id: "1",
        //     link: "twitter",
        //     icon: "fab fa-twitter"
        // },
        // {
        //     id: "2",
        //     link: "telegram",
        //     icon: "fab fa-telegram"
        // },
        // {
        //     id: "3",
        //     link: "globe",
        //     icon: "fas fa-globe"
        // },
        // {
        //     id: "4",
        //     link: "discord",
        //     icon: "fab fa-discord"
        // }
    ])

    const { reloadCounter, getDeployedHistory, getTemplateFee } = useContract()
    const [history, setHistory] = useState([])
    const [template1Fee, setTemplate1Fee] = useState(0)
    const [template2Fee, setTemplate2Fee] = useState(0)

    useEffect(() => {
        let ac = new AbortController()

        getDeployedHistory()
            .then(r => {
                if (ac.signal.aborted === false) {
                    setHistory(r)
                }
            })
            .catch(err => {
                console.log(err)
            })

        getTemplateFee(0)
            .then(r => {
                if (ac.signal.aborted === false) {
                    setTemplate1Fee(r)
                }
            })
            .catch(err => {
                console.log(err)
            })

        getTemplateFee(1)
            .then(r => {
                if (ac.signal.aborted === false) {
                    setTemplate2Fee(r)
                }
            })
            .catch(err => {
                console.log(err)
            })

        return () => ac.abort()
    }, [reloadCounter, getDeployedHistory, getTemplateFee])

    useEffect(() => {
        let fee = [0, template1Fee, template2Fee]

        setData(d => {
            const arr = d.map(item => {
                let deployed = history.filter(t => parseInt(t.template) === item.id)

                let sum = deployed.reduce((p, v) => BN(p).plus(BN(v.c.cost)).toNumber(), 0)
                return {
                    ...item,
                    mecha: `${deployed.length}/1,000 deployed`,
                    progress: deployed.length * 100 / 1000,
                    cost: `${item.id >= fee.length ? 0 : fee[item.id]} $ETH`,
                    busd: `${sum} $ETH`
                }
            })

            if (chainId === 42161) {
                return arr.filter(t => t.id !== 2)
            } else {
                return arr;
            }
        })
    }, [history, template1Fee, template2Fee, chainId])

    useEffect(() => {
        let ac = new AbortController()
        setShowData(false)
        setTimeout(() => {
            if (ac.signal.aborted === false) {
                setShowData(true)
            }
        }, 100)

        return () => ac.abort()
    }, [data])

    return (
        <section id="explore" className="project-area">
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
                <div className="project-slides" style={{ transition: 'all 1s ease-in-out', padding: '20px', opacity: `${showData === true ? '1' : '0'}` }}>
                    <OwlCarousel lazyLoad={true} autoWidth={true} center={false} nav={true} dots={true} rewind={true}
                        autoplay={true} autoplayTimeout={4000} loop={true} autoplayHoverPause={true} className='owl-theme'>
                        {data.map((item, idx) => {
                            return (
                                <div key={`pd_${idx}`} style={{ padding: '20px' }}>
                                    <div key={`pd_${idx}`} className='swiper-slide' style={{ maxWidth: '500px' }}>
                                        <div className="card project-card">
                                            <div className="media">
                                                <Link to={item.link}>
                                                    <img className="card-img-top avatar-max-lg" src={item.img} alt="" />
                                                </Link>
                                                <div className="media-body ml-4">
                                                    <Link to={item.link}>
                                                        <h4 className="m-0">{item.title}</h4>
                                                    </Link>
                                                    {/* <div className="countdown-times">
                                                        <h6 className="my-2">Registration in:</h6>
                                                        <div className="countdown d-flex" data-date={item.reg_date} />
                                                    </div> */}
                                                    {/* Blockchain Icon */}
                                                    <div className="mt-2">
                                                        <img src={item.blockchain} alt="" style={{ maxWidth: '20px' }} />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Project Body */}
                                            <div className="card-body">
                                                {/* <div className="items">
                                                    <div className="single-item">
                                                        <span></span>
                                                        <span> {item.raise}</span>
                                                    </div>
                                                    <div className="single-item">
                                                        <span>Cost</span>
                                                        <span> {item.cost}</span>
                                                    </div>
                                                </div> */}
                                                <div className="item-progress">
                                                    {/* <div className="progress mt-4 mt-md-5">
                                                        <div className="progress-bar" role="progressbar" style={{ width: `${item.progress}%` }} aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100}>{item.progress}%</div>
                                                    </div> */}
                                                    <div className="progress-sale d-flex justify-content-between mt-3">
                                                        <span>{item.mecha}</span>
                                                        <span>{item.busd}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Project Footer */}
                                            <div className="project-footer d-flex align-items-center mt-4 mt-md-5">
                                                {item.link && <Link className="btn btn-bordered-white btn-smaller" to={item.link}>{initData.actionBtn}</Link>}
                                                {/* Social Share */}
                                                <div className="social-share ml-auto">
                                                    <ul className="d-flex list-unstyled">
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
                                </div>
                            );
                        })}
                    </OwlCarousel>
                </div>
            </div>
        </section>
    );
}

export default ProjectOne;