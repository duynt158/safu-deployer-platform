import React, { Component } from 'react';

const initData = {
    sub_heading: "Sign Up",
    heading: "Create an Account",
    btn: "Register account",
    notice: "Fill all fields so we can get some info about you. We'll never send you spam",
    signin_title: "Already have an account?",
    sign_btn: "Sign In"
}

class Register extends Component {
    state = {
        initData: {}
    }
    componentDidMount(){
        this.setState({
            initData: initData
        })
    }
    render() {
        return (
            <section className="apply-area vh-100">
                <div className="container h-100">
                    <div className="row align-items-center justify-content-center h-100">
                        <div className="col-12 col-md-8">
                            <div className="apply-form card no-hover">
                                <form action="#">
                                    {/* Intro */}
                                    <div className="intro d-flex justify-content-between align-items-end mb-4">
                                        <div className="intro-content">
                                            <span className="intro-text">{this.state.initData.sub_heading}</span>
                                            <h3 className="mt-3 mb-0">{this.state.initData.heading}</h3>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Full name</label>
                                        <input type="text" id="name" placeholder="John Deo" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input type="email" id="email" placeholder="name@yourmail.com" />
                                        <small className="form-text mt-2">Enter your email address</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" id="password" />
                                    </div>
                                    <div className="form-group form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label notice" htmlFor="exampleCheck1">I accept the <a href="#">Terms &amp; conditions</a> and <a href="#">Privacy policy</a></label>
                                    </div>
                                    <span className="d-inline-block">{this.state.initData.notice}</span>
                                    <button type="submit" className="btn btn-bordered active mt-4">{this.state.initData.btn} <i className="icon-login ml-2" /></button>
                                    <span className="notice d-block mt-4">{this.state.initData.signin_title} <a href="/login">{this.state.initData.sign_btn}</a></span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Register;