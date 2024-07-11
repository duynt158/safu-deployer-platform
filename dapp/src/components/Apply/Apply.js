import React, { Component } from 'react';

const initData = {
    btn: "Submit My Project",
    notice: "We will review your submissions within 48 hours. If your game potentially fits our platform, we will contact you through your provided email address or on Telegram to arrange a call."
}

class Apply extends Component {
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
            <section className="apply-area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8">
                            <div className="apply-form card no-hover">
                                <form action="#">
                                    <div className="form-group">
                                        <label htmlFor="name">Game name</label>
                                        <input type="text" id="name" placeholder="Galaxy War" />
                                        <small className="form-text mt-2">Enter the name of your game project</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="short-description">Game description</label>
                                        <input type="text" id="short-description" />
                                        <small className="form-text mt-2">Tell us about your game project in a few sentences: genre, idea, concept</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="status">Project status</label>
                                        <input type="text" id="status" />
                                        <small className="form-text mt-2">Describe the stage your project is at</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="amount">Amount you are looking to raise</label>
                                        <input type="text" id="amount" />
                                        <small className="form-text mt-2">Enter the amount you need to deliver your game (e.g. "$100k")</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Describe your game assets you are going to pre-sell as NFTs</label>
                                        <textarea id="description" placeholder="Short Description" cols={30} rows={3} defaultValue={""} />
                                        <small className="form-text mt-2">Briefly describe your assets. E.g. "X units of spaceships"</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="demo">Game demo</label>
                                        <input type="text" id="demo" />
                                        <small className="form-text mt-2">Add a game demo video, or a link to screenshots or artworks</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="web-url">Website URL</label>
                                        <input type="text" id="web-url" />
                                        <small className="form-text mt-2">Your website address</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="link">Pitch-deck link</label>
                                        <input type="text" id="link" />
                                        <small className="form-text mt-2">Google drive / Dropbox link</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="project-email">Contact email</label>
                                        <input type="email" id="project-email" />
                                        <small className="form-text mt-2">We will contact you by your email</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="telegram">Telegram handle</label>
                                        <input type="text" id="telegram" />
                                        <small className="form-text mt-2">We may contact you on Telegram</small>
                                    </div>
                                    <span className="d-inline-block">{this.state.initData.notice}</span>
                                    <button type="submit" className="btn btn-bordered active mt-4">{this.state.initData.btn} <i className="icon-login ml-2" /></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Apply;