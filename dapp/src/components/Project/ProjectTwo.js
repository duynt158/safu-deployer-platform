import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useContract } from '../../contexts/ContractContext';
import { useGlobal } from '../../contexts/GlobalContext';

const ProjectTwo = () => {
    const [initData] = useState({
        sub_heading: "Launched",
        heading: "History",
        btn: "View All",
        actionBtn: "Load More"
    })
    const { TemplateName } = useGlobal()

    const [data, setData] = useState([
        {
            id: 1,
            img: "/img/thumb_6.png",
            blockchain: "/img/ethereum.png",
            title: TemplateName[0],
            price: "0.2ETH",
            publish: "5 hours ago",
            process: "Done",
            deployed: "0xFD3341b8AE197B612bbE64CE42ae13593c0c2137"
        },
        {
            id: 2,
            img: "/img/thumb_7.png",
            blockchain: "/img/ethereum.png",
            title: TemplateName[1],
            price: "0.24ETH",
            publish: "7 hours ago",
            process: "Done",
            deployed: "0xFD3341b8AE197B612bbE64CE42ae13593c0c2137"
        }
    ])

    const [extractedHistory, setExtractedHistory] = useState([])

    const { chainId } = useGlobal()
    const { reloadCounter, getDeployedHistory, getTokenName } = useContract()
    const [history, setHistory] = useState([])
    const [loadMoreCount, setLoadMoreCount] = useState(3)

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

        return () => ac.abort()
    }, [reloadCounter, getDeployedHistory])

    useEffect(() => {
        let ac = new AbortController()

        let labels = [
            '',
            TemplateName[0],
            TemplateName[1]
        ]

        let t = Math.floor(new Date().getTime() / 1000)

        setData(d => {
            return history.map((h, idx) => {
                let templateId = parseInt(h.template)
                let hours = Math.floor((t - parseInt(h.timestamp)) / 3600)
                if (hours < 0) hours = 0

                getTokenName(h.deployedAddress)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setData(arr => {
                            return arr.map((a, ri) => {
                                return ri === idx? { ...a, name: r}: a
                            })
                        })
                    }
                })
                .catch(err => {

                })

                return {
                    id: idx + 1,
                    img: `/img/thumb_${templateId}.png`,
                    blockchain: "/img/ethereum.png",
                    name: '...',
                    template: templateId >= labels.length ? "###" : labels[templateId],
                    price: `${h.c.cost} $ETH`,
                    publish: `${hours} hours ago`,
                    process: "Done",
                    deployed: h.deployedAddress,
                    link: `/search/${h.deployedAddress}`
                }
            })
        })

        return () => ac.abort()
    }, [history, chainId, TemplateName, getTokenName])

    useEffect(() => {
        let len = 10
        if (data.length < 10) len = data.length

        let i
        let ret = []
        for (i = 0; i < len; i ++) {
            ret = [...ret, data[data.length - 1 - i]]
        }
        setExtractedHistory(ret)
    }, [data])

    return (
        <section className="explore-area prev-project-area load-more p-0">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {/* Intro */}
                        <div className="intro d-flex justify-content-between align-items-end m-0">
                            <div className="intro-content">
                                <span className="intro-text">{initData.sub_heading}</span>
                                <h3 className="mt-3 mb-0">{initData.heading}({data.length})</h3>
                            </div>
                            <div className="intro-btn">
                                <Link className="btn content-btn" to="#">{initData.btn}</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row items">
                    {extractedHistory.map((item, idx) => {
                        return (
                            <div key={`pdt_${idx}`} className="col-12 item" style={{display: idx < loadMoreCount? 'block': 'none'}}>
                                <div className="card project-card prev-project-card">
                                    <div className="project-content d-md-flex flex-column flex-md-row align-items-center justify-content-md-between">
                                        <div className="item-header d-flex align-items-center mb-4 mb-md-0">
                                            <img className="card-img-top avatar-max-lg" src={item.img} alt="" />
                                            <div className="content ml-4">
                                                <h4 className="m-0">{item.name}</h4>
                                                <h6 className="mt-3 mb-0" style={{ overflowWrap: 'anywhere' }}>{item.template}</h6>
                                                <h6 className="mt-3 mb-0" style={{ overflowWrap: 'anywhere' }}>{item.deployed}</h6>
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
                                            <span></span>
                                            <span>{item.price}</span>
                                        </div>
                                    </div>
                                    {/* <a className="project-link" href={item.link} target='_blank'/> */}
                                    <Link className='project-link' to={item.link} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="row">
                    <div className="col-12 text-center">
                        <div className="btn btn-bordered-white mt-4 mt-md-5" style={{display: loadMoreCount >= history.length? 'none': 'inline-block'}}
                            onClick={() => {loadMoreCount <= history.length - 3? setLoadMoreCount(t => t + 3): setLoadMoreCount(history.length)}}>
                                {initData.actionBtn}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProjectTwo;