import React, { useEffect, useRef, useState, useCallback } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { AddLPContainer } from './styles'
import { useCustomWallet } from '../../contexts/WalletContext';
import { useContract } from '../../contexts/ContractContext';
import { Link, useNavigate } from 'react-router-dom'
import useLockContext from '../../hooks/useLockContext';
import LockHistory from './LockHistory';
import { useGlobal } from '../../contexts/GlobalContext';

const Locker = ({token}) => {
    const { isLoggedIn, wallet } = useCustomWallet()
    const { balanceOf } = useContract()
    const { chainId } = useGlobal()

    const [lpAddressInput, setLPAddressInput] = useState(token === undefined? '': token)
    
    const { handleApproveLP, handleLock, 
        lpApprovedAmount, lockFee, lpBalance, lpLockedBalance, lpTotalBalance, lpSymbol } = useLockContext(lpAddressInput)

    const [lockLPAmount, setLockLPAmount] = useState('')
    const [lpDays, setLPDays] = useState(0)
    const [error, setError] = useState('')

    const [startDate, setStartDate] = useState(new Date())

    const navigate = useNavigate()

    const handleDateChanged = useCallback((date) => {
        setStartDate(date)
        setLPDays(Math.round(((new Date(date)).getTime() - (new Date()).getTime()) / 86400000))
    }, [])

    useEffect(() => {
        setError('')
        if (lpBalance === undefined) {
            setError('Unable to get LP balance')
        }
    }, [lpBalance, isLoggedIn])

    const acRef = useRef()
    acRef.current = new AbortController()

    useEffect(() => {
        if (lpAddressInput?.length > 0 && token?.toLowerCase() !== lpAddressInput?.toLowerCase()) {
            acRef.current.abort()
            let ac = new AbortController()
            acRef.current = ac

            setTimeout(() => {
                if (ac.signal.aborted === false) {
                    navigate(`/locker/${lpAddressInput}`)
                }
            }, 2000)

            return () => ac.abort()
        }
    }, [lpAddressInput, wallet.address, chainId, balanceOf, token, navigate])

    return (
        <section className="leaderboard-area">
            <div className="container">
                <AddLPContainer>
                    <h4>Lock LP Token {lpSymbol && `(${lpSymbol})`}</h4>
                    <div className='row'>
                        <div className='item-1 col-12'>
                            <span>LP Address</span>
                            <input type='text' className='lp-value' value={lpAddressInput} onChange={e => setLPAddressInput(e.target.value)} />
                        </div>
                    </div>
                    <div className='lp-frame mt-4'>
                        <div className='d-flex flex-column flex-md-row' style={{gap: '20px', flexGap: '20px'}}>
                            <div className='d-flex flex-column show-item'>
                                <div className='text-center'>Total Supply</div>
                                <div className='text-center small-label'>{lpTotalBalance.toString()}</div>
                            </div>
                            <div className='d-flex flex-column show-item'>
                                <div className='text-center'>Locked</div>
                                <div className='text-center small-label'>{lpLockedBalance.toString()}</div>
                            </div>
                        </div>
                    </div>
                    <div className='lp-frame mt-4'>
                        <span className='lp-fee'>{lockFee === 0 ? 'No Fee' : `${lockFee} $ETH`}</span>
                    </div>
                    <div className='row'>
                        <div className='item-1 col-12 col-md-6'>
                            <span>LP Amount (max. <span className='max-label' onClick={() => setLockLPAmount(lpBalance?.toString())}>{lpBalance?.toString()}</span>)</span>
                            <input type='text' className='lp-value' value={lockLPAmount} onChange={e => setLockLPAmount(e.target.value)} />
                        </div>
                        <div className='item-1 col-12 col-md-6'>
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
                                    lpApprovedAmount.lt(lockLPAmount) ?
                                        <div className='push-button' onClick={handleApproveLP}>{"Approve"}</div>
                                        :
                                        <div className='push-button' onClick={() => handleLock(lockLPAmount, lockFee, Math.floor(parseFloat(lpDays) * 86400))}>{"Lock"}</div>
                            }
                        </div>
                    }
                </AddLPContainer>
                {
                    error?
                        <h5 className='text-center'>{error}</h5>
                        :
                        <LockHistory token={token} />
                }
            </div>
        </section>
    )
}

export default Locker