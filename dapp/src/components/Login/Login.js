import React, { Component } from 'react';

const initData = {
    sub_heading: "Login",
    heading: "Welcome Back!",
    btn: "Sign In",
    notice: "Don't have an account?",
    reset_title: "Forgot password?",
    signup_title: "Sign Up Now!"
}

class Login extends Component {
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
                        <div className="col-12 col-md-7">
                            <div className="apply-form card no-hover">
                                {/* Intro */}
                                <div className="intro d-flex justify-content-between align-items-end mb-4">
                                    <div className="intro-content">
                                        <span className="intro-text">{this.state.initData.sub_heading}</span>
                                        <h3 className="mt-3 mb-0">{this.state.initData.heading}</h3>
                                    </div>
                                </div>
                                <form action="#">
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input type="email" id="email" placeholder="name@yourmail.com" />
                                        <small className="form-text mt-2">Enter your email address</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" id="password" />
                                    </div>
                                    <div className="checkbox-area d-flex align-items-center justify-content-between">
                                        <div className="form-group form-check mb-0">
                                            <input type="checkbox" className="form-check-input" id="form-checkbox" />
                                            <label className="form-check-label" htmlFor="form-checkbox">Remember me</label>
                                        </div>
                                        <a className="reset-link" href="/reset">{this.state.initData.reset_title}</a>
                                    </div>
                                    <button type="submit" className="btn btn-bordered active my-4">{this.state.initData.btn} <i className="icon-login ml-2" /></button>
                                    <span className="notice d-block">{this.state.initData.notice} <a href="/register">{this.state.initData.signup_title}</a></span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Login;