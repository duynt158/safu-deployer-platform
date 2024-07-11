import React, { useState } from 'react';

const Work = () => {
    const [data] = useState({
        heading: "How To Participate",
        sub_heading: "How It Works",
        workData: [
            {
                id: 1,
                icon: 'icons icon-drawer text-effect',
                title: 'Choose Token Template',
                content: "", //"You may submit your KYC to the community of this platform. It's not mandatory"
            },
            {
                id: 2,
                icon: 'icons icon-wallet text-effect',
                title: 'Connect Wallet',
                content: "", //"It's better to verify your wallet in order not to be recognized as a scammer. It's not mandatory"
            },
            {
                id: 3,
                icon: 'icons icon-fire text-effect',
                title: 'Deploy',
                content: "", //"Let's go to the world of easy blockchain."
            }
        ]
    })

    return (
        <section className="work-area">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {/* Intro */}
                        <div className="intro d-flex justify-content-between align-items-end mb-4">
                            <div className="intro-content">
                                <span className="intro-text">{data.sub_heading}</span>
                                <h3 className="mt-3 mb-0">{data.heading}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row items">
                    {data.workData.map((item, idx) => {
                        return (
                            <div key={`wd_${idx}`} className="col-12 col-sm-6 col-lg-4 item">
                                {/* Single Work */}
                                <div className="single-work">
                                    <i className={item.icon} />
                                    <h4>{item.title}</h4>
                                    <p>{item.content}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Work;