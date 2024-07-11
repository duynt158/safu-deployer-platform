import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../../contexts/GlobalContext';
import { useCustomWallet } from '../../contexts/WalletContext'
import walletConfig from '../../contexts/WalletContext/config'

const Header = () => {
    const { isLoggedIn, wallet } = useCustomWallet()
    const { TemplateName, chainId } = useGlobal()

    return (
        <header id="header">
            {/* Navbar */}
            <nav data-aos="zoom-out" data-aos-delay={800} className="navbar gameon-navbar navbar-expand">
                <div className="container header">
                    {/* Logo */}
                    <Link className="navbar-brand" to="/">
                        <img src="/img/logo.png" alt="Brand Logo" />
                    </Link>
                    <div className="ml-auto" />
                    {/* Navbar Nav */}
                    <ul className="navbar-nav items mx-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        {/* <li className="nav-item dropdown">
                            <a href="#" className="nav-link">Projects <i className="icon-arrow-down" /></a>
                            <ul className="dropdown-menu">
                                <li className="nav-item">
                                    <a href="/project-one" className="nav-link">Project Style 1</a>
                                </li>
                                <li className="nav-item">
                                    <a href="/project-two" className="nav-link">Project Style 2</a>
                                </li>
                                <li className="nav-item">
                                    <a href="/project-three" className="nav-link">Project Style 3</a>
                                </li>
                                <li className="nav-item">
                                    <a href="/project-four" className="nav-link">Project Style 4</a>
                                </li>
                                <li className="nav-item">
                                    <a href="/project-single" className="nav-link">Project Single</a>
                                </li>
                            </ul>
                        </li> */}
                        <li className="nav-item dropdown">
                            <Link to="#" className="nav-link">Deploy <i className="icon-arrow-down" /></Link>
                            <ul className="dropdown-menu">
                                <li className="nav-item">
                                    <Link to="/template-one" className="nav-link">{TemplateName[0]}</Link>
                                </li>
                                {
                                    chainId !== 42161 &&
                                    <li className="nav-item">
                                        <Link to="/template-two" className="nav-link">{TemplateName[1]}</Link>
                                    </li>
                                }
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link to="/locker" className="nav-link">Locker</Link>
                        </li>
                        {/* <li className="nav-item dropdown">
                            <a href="#" className="nav-link">Pages <i className="icon-arrow-down" /></a>
                            <ul className="dropdown-menu">
                                <li className="nav-item">
                                    <a href="/farming" className="nav-link">Farming</a>
                                </li>
                                <li className="nav-item">
                                    <a href="/leaderboard" className="nav-link">Leaderboard</a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a href="#" className="nav-link">Inner Pages <i className="icon-arrow-right" /></a>
                                    <ul className="dropdown-menu">
                                        <li className="nav-item">
                                            <a href="/apply" className="nav-link">Apply for Project</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="/wallet-connect" className="nav-link">Wallet Connect</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="/help-center" className="nav-link">Help Center</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="/contact" className="nav-link">Contact</a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown">
                                    <a href="#" className="nav-link">Auth Pages <i className="icon-arrow-right" /></a>
                                    <ul className="dropdown-menu">
                                        <li className="nav-item">
                                            <a href="/login" className="nav-link">Login</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="/register" className="nav-link">Register</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="/reset" className="nav-link">Forgot Password</a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <a href="/tokenomics" className="nav-link">Tokenomics</a>
                                </li>
                                <li className="nav-item">
                                    <a href="/tier-system" className="nav-link">Tier System</a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a href="#" className="nav-link">Community <i className="icon-arrow-right" /></a>
                                    <ul className="dropdown-menu">
                                        <li className="nav-item">
                                            <a href="/blog" className="nav-link">Blog</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="/blog-single" className="nav-link">Blog Single</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link to="/contact" className="nav-link">Contact</Link>
                        </li> */}
                    </ul>
                    {/* Navbar Icons */}
                    <ul className="navbar-nav icons">
                        <li className="nav-item">
                            {/* data-toggle="modal" data-target="#search" */}
                            <Link to="/search" className="nav-link">
                                <i className="icon-magnifier" />
                            </Link>
                        </li>
                    </ul>
                    {/* Navbar Toggler */}
                    <ul className="navbar-nav toggle">
                        <li className="nav-item">
                            <Link to="#" className="nav-link" data-toggle="modal" data-target="#menu">
                                <i className="icon-menu m-0" />
                            </Link>
                        </li>
                    </ul>
                    {/* Active Chain Icon */}
                    <ul className="navbar-nav icons">
                        <li className="nav-item">
                            {
                                isLoggedIn() === true ?
                                    <a href={`${walletConfig[chainId].blockUrls[0]}address/${wallet.address}`} target='_blank' rel='noreferrer' className="nav-link">
                                        <img src={`${walletConfig[chainId].logo}`} alt='chain logo' style={{ maxWidth: '32px' }} />
                                    </a>
                                    :
                                    <Link to='/connect-wallet' className="nav-link">
                                        <img src={`${walletConfig[chainId].logo}`} alt='chain logo' style={{ maxWidth: '32px' }} />
                                    </Link>
                            }
                        </li>
                    </ul>
                    {/* Navbar Action Button */}
                    <ul className="navbar-nav action">
                        <li className="nav-item ml-2">
                            <Link to="/connect-wallet" className="btn ml-lg-auto btn-bordered-white">
                                <i className="icon-wallet mr-md-2" />
                                {
                                    isLoggedIn() === true ?
                                        'My Wallet'
                                        :
                                        'Connect Wallet'
                                }
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;