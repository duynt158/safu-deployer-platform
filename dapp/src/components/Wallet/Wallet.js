import React, { useState, useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

import { useNavigate } from 'react-router';
import { useGlobal } from '../../contexts/GlobalContext';
import { useCustomWallet } from '../../contexts/WalletContext'
import useToast from '../../hooks/useToast';
import { ChainSelectContainer } from './styles';

const Wallet = () => {
    const { chainId, switchChain } = useGlobal()
    const { isLoggedIn, wallet, connectWallet, disconnectWallet } = useCustomWallet()
    const navigate = useNavigate()
    const { showLoading, hideLoading } = useToast()

    const [data] = useState(
        {
            sub_heading: 'Connect Wallet',
            heading: 'Connect your Wallet',
            content: 'You may connect to the wallet of several types such as Metamask, WalletConnect ...'
        }
    )

    const connectMetamask = useCallback(() => {
        connectWallet('injected')
            .then((r) => {
                showLoading('Redirecting...')
                setTimeout(() => {
                    if (r.length > 0) {
                        navigate(-1)
                    }
                    hideLoading()
                }, 2000)
            })
    }, [connectWallet, navigate, showLoading, hideLoading])

    const connectWalletConnect = useCallback(() => {
        connectWallet('walletconnect')
            .then((r) => {
                showLoading('Redirecting...')
                setTimeout(() => {
                    if (r.length === true) {
                        navigate(-1)
                    }
                    hideLoading()
                }, 2000)
            })
    }, [connectWallet, navigate, showLoading, hideLoading])

    const handleChainSelect = useCallback((chainIndex) => {
        switchChain(chainIndex)
    }, [switchChain])

    const [walletData] = useState(
        [
            { id: 1, img: '/img/metamask.png', title: 'MetaMask', content: "A browser extension with great flexibility. The web's most popular wallet" },
            // { id: 2, img: '/img/authereum.png', title: 'Authereum', content: 'A user-friendly wallet that allows you to sign up with your phone number on any device' },
            { id: 3, img: '/img/walletconnect.png', title: 'WalletConnect', content: 'Pair with Trust, Argent, MetaMask & more. Works from any browser, without an extension' },
            // { id: 4, img: '/img/dapper.png', title: 'Dapper', content: 'A security-focused cloud wallet with pin codes and multi-factor authentication' },
            // { id: 5, img: '/img/kaikas.png', title: 'Kaikas', content: 'A simple-to-use wallet that works on both mobile and through a browser extension' }
        ]
    )

    return (
        <section className="wallet-connect-area">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-7">
                        {/* Intro */}
                        <div className="intro text-center">
                            <div className="intro-content">
                                <span className="intro-text">{data.sub_heading}</span>
                                <h3 className="mt-3 mb-0">{data.heading}</h3>
                                <p>{data.content}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center items">
                    {
                        isLoggedIn() === true ?
                            <>
                                <h4 className='col-12 col-md-6 col-lg-4' style={{ margin: '0' }}>{wallet.address.slice(0, 8) + '...' + wallet.address.slice(-4)}</h4>
                                <div className='col-12 col-md-6 col-lg-4 btn btn-bordered-white' onClick={disconnectWallet}>Disconnect</div>
                            </>
                            :
                            walletData.map((item, idx) => {
                                return (
                                    <div key={`wd_${idx}`} className="col-12 col-md-6 col-lg-4 item">
                                        {/* Single Wallet */}
                                        <div className="card single-wallet" onClick={item.title === 'MetaMask' ? connectMetamask : item.title === 'WalletConnect' ? connectWalletConnect : () => { }} style={{ cursor: 'pointer' }}>
                                            <div className="d-block text-center">
                                                <img className="avatar-lg" src={item.img} alt="" />
                                                <h4 className="mb-0">{item.title}</h4>
                                                <p>{item.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                    }
                </div>
                <div className='d-flex flex-column p-4 mt-4' style={{ flexGap: '20px', gap: '20px' }}>
                    <h3 className='text-center'>Select Chain</h3>
                    <ChainSelectContainer onClick={() => handleChainSelect(0)}>
                        <div className='selected-mark'>
                            {
                                chainId === 1 &&
                                <FontAwesomeIcon icon={icon({ name: 'circle-check', style: 'solid' })} />
                            }
                        </div>
                        <div className='d-flex flex-column' style={{ flexGap: '10px', gap: '10px' }}>
                            <div className='d-flex flex-row align-items-center' style={{ flexGap: '20px', gap: '20px' }}>
                                <img src='/img/ethereum.png' alt='ethereum' className='logo' />
                                <h4>Ethereum</h4>
                            </div>
                            <span className='description'>Mostly used blockchain. Please select Ethereum mainnet to deploy tokens of 2 templates</span>
                        </div>
                    </ChainSelectContainer>
                    <ChainSelectContainer onClick={() => handleChainSelect(2)}>
                        <div className='selected-mark'>
                            {
                                chainId === 42161 &&
                                <FontAwesomeIcon icon={icon({ name: 'circle-check', style: 'solid' })} />
                            }
                        </div>
                        <div className='d-flex flex-column' style={{ flexGap: '10px', gap: '10px' }}>
                            <div className='d-flex flex-row align-items-center' style={{ flexGap: '20px', gap: '20px' }}>
                                <img src='/img/arbitrum.png' alt='arbitrum' className='logo' />
                                <h4>Arbitrum One</h4>
                            </div>
                            <span className='description'>Fast and cheap blockchain. Please select Arbitrum One to deploy tokens of simple tax template</span>
                        </div>
                    </ChainSelectContainer>
                </div>
            </div>
        </section>
    );
}

export default Wallet;