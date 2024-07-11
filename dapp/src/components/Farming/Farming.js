import React, { Component } from 'react';
import axios from 'axios';

const BASE_URL = "https://my-json-server.typicode.com/themeland/gameon-json-1/farming";

class Farming extends Component {
    state = {
        farmingData: []
    }
    componentDidMount(){
        axios.get(`${BASE_URL}`)
            .then(res => {
                this.setState({
                    farmingData: res.data.farmingData
                })
                // console.log(this.state.data)
            })
        .catch(err => console.log(err))
    }
    render() {
        return (
            <section className="staking-area">
                <div id="gameon-accordion" className="container accordion">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10">
                            {/* Single Accordion Item */}
                            {this.state.farmingData.map((item, idx) => {
                                return (
                                    <div key={`fard_${idx}`} className="single-accordion-item">
                                        {/* Card Header */}
                                        <div className="card-header bg-inherit border-0 p-0">
                                            <h2 className="m-0">
                                                <button className="btn staking-btn d-block text-left w-100 py-4" type="button" data-toggle="collapse" data-target={item.collapse_link}>
                                                    <div className="row">
                                                        <div className="col-12 col-md-8">
                                                            <div className="media flex-column flex-md-row">
                                                                <img className="avatar-max-lg" src={item.img_1} alt="" />
                                                                <div className="content media-body mt-4 mt-md-0 ml-md-4">
                                                                    <h4 className="m-0">{item.title_1}</h4>
                                                                    <span className="d-inline-block mt-2">{item.category}</span>
                                                                    <p>{item.content}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row staking-info align-items-center justify-content-center mt-4 mt-md-5">
                                                        <div className="col single-item">
                                                            <span>{item.staked}</span>
                                                            <span>Staked</span>
                                                        </div>
                                                        <div className="col single-item">
                                                            <span>{item.earned}</span>
                                                            <span>Earned</span>
                                                        </div>
                                                        <div className="col single-item">
                                                            <span>{item.apy}</span>
                                                            <span>APY</span>
                                                        </div>
                                                        <div className="col single-item">
                                                            <span>{item.price}</span>
                                                            <span>LP Price</span>
                                                        </div>
                                                        <div className="col single-item">
                                                            <span>{item.value}</span>
                                                            <span>Total Value Locked</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </h2>
                                        </div>
                                        <div id={item.collapse_id} className="collapse" data-parent="#gameon-accordion">
                                            {/* Card Body */}
                                            <div className="card-body">
                                                <div className="row">
                                                    {/* Single Staking Item */}
                                                    <div className="col-12 col-md-4 single-staking-item input-box">
                                                        <span className="item-title mb-2">{item.input_title_1}</span>
                                                        <div className="input-area d-flex flex-column">
                                                            <div className="input-text">
                                                                <input type="text" placeholder={0.00} />
                                                                <a href="#">Max</a>
                                                            </div>
                                                            <a href="#" className="btn input-btn mt-2">{item.input_btn_1}</a>
                                                        </div>
                                                    </div>
                                                    {/* Single Staking Item */}
                                                    <div className="col-12 col-md-4 single-staking-item input-box">
                                                        <span className="item-title mb-2">{item.input_title_2}</span>
                                                        <div className="input-area d-flex flex-column">
                                                            <div className="input-text">
                                                                <input type="text" placeholder={0.00} />
                                                                <a href="#">Max</a>
                                                            </div>
                                                            <a href="#" className="btn input-btn mt-2">{item.input_btn_2}</a>
                                                        </div>
                                                    </div>
                                                    {/* Single Staking Item */}
                                                    <div className="col-12 col-md-4 single-staking-item input-box">
                                                        <span className="item-title mb-2">{item.reward_title}</span>
                                                        <div className="input-area d-flex flex-column">
                                                            <h4 className="price m-0">{item.reward}</h4>
                                                            <span className="reward my-2">{item.reward_content}</span>
                                                            <a href="/login" className="btn input-btn mt-2"><i className="fa-solid fa-lock mr-1" /> {item.actionBtn}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Farming;