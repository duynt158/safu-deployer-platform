import React, { Component } from 'react';
import axios from 'axios';

const BASE_URL = "https://my-json-server.typicode.com/themeland/gameon-json-2/help";

class Help extends Component {
    state = {
        data: {},
        helpData: []
    }
    componentDidMount(){
        axios.get(`${BASE_URL}`)
            .then(res => {
                this.setState({
                    data: res.data,
                    helpData: res.data.helpData
                })
                // console.log(this.state.data)
            })
        .catch(err => console.log(err))
    }
    render() {
        return (
            <section className="help-center-area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-7">
                            {/* Intro */}
                            <div className="intro text-center">
                                <div className="intro-content">
                                    <span className="intro-text">{this.state.data.sub_heading}</span>
                                    <h3 className="mt-3 mb-0">{this.state.data.heading}</h3>
                                    <p>{this.state.data.content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center items">
                        {this.state.helpData.map((item, idx) => {
                            return (
                                <div key={`hcd_${idx}`} className="col-12 col-md-6 col-lg-4 item">
                                    {/* Help Card */}
                                    <div className="card help-card">
                                        <a className="d-block text-center" href="/contact">
                                            <i className={item.icon} />
                                            <h4>{item.title}</h4>
                                            <p>{item.content}</p>
                                        </a>
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

export default Help;