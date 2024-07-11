import React, { useState, useCallback } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import useTokenContract from '../../hooks/useTokenContract';
import { AddLPContainer } from './styles'
import walletConfig from '../../contexts/WalletContext/config'
import { useGlobal } from '../../contexts/GlobalContext';
import { useCustomWallet } from '../../contexts/WalletContext';
import { Link } from 'react-router-dom'
import LockHistory from './LockHistory';

const Liquidity = ({ token }) => {
    const { chainId } = useGlobal()
    const { isLoggedIn } = useCustomWallet()
    const { handleApprove, handleAddToLP, 
        lpAddress, tokenBalance, tokenSymbol, ethBalance, lockApprovedAmount } = useTokenContract(token)

    const [addToLPToken, setAddToLPToken] = useState('')
    const [addToLPETH, setAddToLPETH] = useState('')
    const [days, setDays] = useState('')
    const [startDate, setStartDate] = useState(new Date())

    const handleDateChanged = useCallback((date) => {
        setStartDate(date)
        setDays(Math.round(((new Date(date)).getTime() - (new Date()).getTime()) / 86400000))
    }, [])

    return (
        <section className="leaderboard-area">
            <div className="container">
                <AddLPContainer>
                    <h4>Add To LP & Lock</h4>
                    <div className='lp-frame'>
                        {
                            lpAddress === undefined ?
                                'Not Created LP'
                                :
                                lpAddress === '' ?
                                    'Loading LP...'
                                    :
                                    <><span>LP Address - </span><a href={`${walletConfig[chainId].blockUrls[0]}address/${lpAddress}`} target='_blank' rel='noreferrer' className='lp-link'>{lpAddress}</a></>}
                    </div>
                    <div className='lp-frame'>
                        <span className='lp-fee'>No Fee</span>
                    </div>
                    <div className='row'>
                        <div className='item-1 col-12 col-md-4'>
                            <span>{tokenSymbol} Amount (max. <span className='max-label' onClick={() => setAddToLPToken(tokenBalance.toString())}>{tokenBalance.toString()}</span>)</span>
                            <input type='text' className='lp-value' value={addToLPToken} onChange={e => setAddToLPToken(e.target.value)} />
                        </div>
                        <div className='item-1 col-12 col-md-4'>
                            <span>ETH Amount (max. <span className='max-label' onClick={() => setAddToLPETH(ethBalance)}>{parseFloat(ethBalance).toFixed(3)}</span>)</span>
                            <input type='text' className='lp-value' value={addToLPETH} onChange={e => setAddToLPETH(e.target.value)} />
                        </div>
                        <div className='item-1 col-12 col-md-4'>
                            <span>Date (Min. 7 days)</span>
                            <DatePicker selected={startDate} onChange={(date) => handleDateChanged(date)} />
                        </div>
                    </div>
                    {
                        <div className='row justify-content-center p-4 button-frame'>
                            {
                                isLoggedIn() !== true ?
                                    <Link className='push-button' to='/connect-wallet'>{"Connect Wallet"}</Link>
                                    :
                                    lockApprovedAmount.lt(addToLPToken) ?
                                        <div className='push-button' onClick={handleApprove}>{"Approve"}</div>
                                        :
                                        <div className='push-button' onClick={() => handleAddToLP(addToLPToken, addToLPETH, Math.floor(parseFloat(days) * 86400))}>{"Add To LP"}</div>
                            }
                        </div>
                    }
                </AddLPContainer>
                <LockHistory token={lpAddress} />
            </div>
        </section>
    )
}

export default Liquidity