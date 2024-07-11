import React, { Component } from 'react';
import axios from 'axios';

const BASE_URL = "https://my-json-server.typicode.com/themeland/gameon-json-2/blog";

class Blog extends Component {
    state = {
        blogData: []
    }
    componentDidMount(){
        axios.get(`${BASE_URL}`)
            .then(res => {
                this.setState({
                    blogData: res.data.blogData
                })
                // console.log(this.state.data)
            })
        .catch(err => console.log(err))
    }
    render() {
        return (
            <section className="blog-area">
                <div className="container">
                    <div className="row items">
                        {this.state.blogData.map((item, idx) => {
                            return (
                                <div key={`bd_${idx}`} className="col-12 col-md-6 col-lg-4 item">
                                    {/* Single Blog */}
                                    <div className="card blog-card">
                                        {/* Blog Thumb */}
                                        <div className="blog-thumb">
                                            <a href="/blog-single"><img src={item.img} alt="" /></a>
                                        </div>
                                        {/* Blog Content */}
                                        <div className="blog-content">
                                            {/* Meta Info */}
                                            <ul className="meta-info d-flex justify-content-between list-unstyled mt-4">
                                                <li>By <a href="/blog-single">{item.author}</a></li>
                                                <li><a href="/blog-single">{item.date}</a></li>
                                            </ul>
                                            {/* Blog Title */}
                                            <a href="/blog-single">
                                                <h4>{item.title}</h4>
                                            </a>
                                            <p>{item.content}</p>
                                            {/* Blog Button */}
                                            <a className="btn content-btn" href="/blog-single">{item.btnText}</a>
                                        </div>
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

export default Blog;