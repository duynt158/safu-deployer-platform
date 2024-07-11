import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const data = {
    sub_heading: "KISS Deployer",
    heading: "Deploying & Managing your Tokens in 1 Click",
    content: "Deploying Ecosystem for Several Templates of Tokens"
}

const Hero = () => {
    const [initData, setInitData] = useState(data)

    return (
        <section className="hero-section">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                <div className="col-12 col-md-6 col-lg-9 text-center">
                    {/* Hero Content */}
                    <div className="hero-content">
                        <div className="intro text-center mb-5">
                            <span className="intro-text">{initData.sub_heading}</span>
                            <h1 className="mt-4 intro-cap">{initData.heading}</h1>
                            <p>{initData.content}</p>
                        </div>
                        {/* Buttons */}
                        <div className="button-group">
                            <Link className="btn btn-bordered active smooth-anchor" to="/template-one"><i className="icon-rocket mr-2" />Deploy</Link>
                            <Link className="btn btn-bordered-white" to="/search"><i className="icon-magnifier mr-2" />Search</Link>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;