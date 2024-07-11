import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useContract } from '../../contexts/ContractContext'
import { useGlobal } from '../../contexts/GlobalContext'
import useTokenContract from '../../hooks/useTokenContract'
import Template1 from './OwnerPage/Template1'
import Template2 from './OwnerPage/Template2'
import { useCustomWallet } from '../../contexts/WalletContext'

const TemplateSearch = ({ token }) => {
    const { wallet } = useCustomWallet()
    const { templateId, tokenName, tokenSymbol, tokenSupply, tokenBalance, owner, deployedHistory, deployerOwner, feeWallets } = useTokenContract(token)
    const { isAddressFormat, verifyContract } = useContract()
    const { stringFormat, TemplateName } = useGlobal()
    const [searchText, setSearchText] = useState(token)
    const [errorText, setErrorText] = useState('')
    const [verifyRet, setVerifyRet] = useState('')

    const navigate = useNavigate()

    const acRef = useRef()
    acRef.current = new AbortController()

    useEffect(() => {
        if (isAddressFormat(searchText)) {
            setErrorText('')

            if (searchText !== token) {
                acRef.current.abort()
                let ac = new AbortController()
                acRef.current = ac

                setErrorText('Loading Information...')
                setTimeout(() => {
                    if (ac.signal.aborted === false) {
                        setErrorText('')
                        navigate(`/search/${searchText}`)
                    }
                }, 2000)
            }
        }
        else {
            setErrorText('Incorrect Address Format')
            if (token !== undefined) {
                setTimeout(() => {
                    if (acRef.current.signal.aborted === false) {
                        setErrorText('')
                        navigate(`/search`)
                    }
                }, 2000)
            }
        }

        return () => acRef.current.abort()
    }, [searchText, token, navigate, isAddressFormat])

    useEffect(() => {
        if (templateId === 0) {
            setErrorText('Network Busy or Invalid Token')
        }
    }, [templateId])

    const verifyHandler = useCallback(async () => {
        if (deployedHistory.length === 0) {
            console.log('Could not load constructor parameters')
            return
        }

        let d = deployedHistory.find(d => d.deployedAddress.toLowerCase() === token.toLowerCase())
        let t = await verifyContract(token, templateId, owner, d.param)
        console.log('Verification', t)
        setVerifyRet(t)
    }, [templateId, token, owner, deployedHistory, verifyContract])

    return (
        <section className="staking-area">
            <div className='container input-area d-flex flex-column flex-md-row align-items-center p-4' style={{ gap: '20px' }}>
                <span style={{ whiteSpace: 'nowrap' }}>Token Address</span>
                <input type='text' className='' value={searchText} onChange={e => setSearchText(e.target.value)} />
            </div>
            {
                deployedHistory.length > 0 &&
                (deployerOwner.toLowerCase() === wallet.address.toLowerCase() || feeWallets.find(f => f.toLowerCase() === wallet.address.toLowerCase()) !== undefined) &&
                <div className='container input-area d-flex flex-column flex-md-row align-items-center p-4' style={{ gap: '20px' }}>
                    <button onClick={verifyHandler} style={{
                        background: '#fff2',
                        border: 'none',
                        outline: 'none',
                        color: 'white',
                        fontWeight: '800',
                        borderRadius: '24px',
                        padding: '8px 16px'
                    }}>
                        Verify
                    </button>
                    <p>{parseInt(verifyRet.status) === 0? `Failed: ${verifyRet.result}`: parseInt(verifyRet.status) === 1? `Success: ${verifyRet.result}`: ""}</p>
                </div>
            }
            <div id="gameon-accordion" className="container accordion">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10">
                        {
                            errorText ?
                                <h4>{errorText}</h4>
                                :
                                <div className="single-accordion-item">
                                    {/* Card Header */}
                                    <div className="card-header bg-inherit border-0 p-0">
                                        <h2 className="m-0">
                                            <button className="btn staking-btn d-block text-left w-100 py-4 normal-text" type="button" data-toggle="collapse" data-target='#collapseOne'>
                                                <div className="row">
                                                    <div className="col-12 col-md-8">
                                                        <div className="media flex-column flex-md-row">
                                                            <img className="avatar-max-lg" src={`/img/thumb_${templateId > 0 ? templateId : 3}.png`} alt="" />
                                                            <div className="content media-body mt-4 mt-md-0 ml-md-4">
                                                                <h4 className="m-0">{templateId > 0 ? TemplateName[templateId - 1] : "#"}</h4>
                                                                <span className="d-inline-block mt-2">Template {templateId}</span>
                                                                <p>It is a token contract deployed by this platform. We support users to configure token contract for their purposes.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row staking-info align-items-center justify-content-center mt-4 mt-md-5" style={{ flexGap: '20px', gap: '20px' }}>
                                                    <div className="col single-item">
                                                        <span>{tokenName}</span>
                                                        <span>Name</span>
                                                    </div>
                                                    <div className="col single-item">
                                                        <span>{tokenSymbol}</span>
                                                        <span>Symbol</span>
                                                    </div>
                                                    <div className="col single-item">
                                                        <span>{stringFormat(tokenSupply.toString())}</span>
                                                        <span>Supply</span>
                                                    </div>
                                                    <div className="col single-item">
                                                        <span>{stringFormat(tokenBalance.toString())}</span>
                                                        <span>Balance</span>
                                                    </div>
                                                    <div className="col single-item">
                                                        <span>{owner.length > 12 ? owner.slice(0, 6) + '...' + owner.slice(-4) : ''}</span>
                                                        <span>Owner</span>
                                                    </div>
                                                </div>
                                            </button>
                                        </h2>
                                    </div>
                                    <div id='collapseOne' className="collapse" data-parent="#gameon-accordion">
                                        {/* Card Body */}
                                        <div className="card-body">
                                            {
                                                templateId === 1 ?
                                                    <Template1 token={token} tokenOwner={owner} />
                                                    :
                                                    templateId === 2 ?
                                                        <Template2 token={token} tokenOwner={owner} />
                                                        :
                                                        <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TemplateSearch;