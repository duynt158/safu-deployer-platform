import { useState, useEffect, useCallback } from 'react'
import { useContract } from '../../contexts/ContractContext'
import { useGlobal } from '../../contexts/GlobalContext'
import { useCustomWallet } from '../../contexts/WalletContext'
import useToast from '../useToast'
import ADDRESSES from '../../contexts/ContractContext/address'
import BigNumber from 'bignumber.js'

const useLockContext = (token) => {
    const { chainId } = useGlobal()
    const { showLoading, hideLoading, toastSuccess, toastError } = useToast()
    const { wallet } = useCustomWallet()
    const { reloadCounter, refreshPages, approveToken, lockLP, unlockLP,
        getTokenApprovedAmount, getLockedRecords, getFeeAmount, balanceOf, getTokenSupply, getTokenSymbol } = useContract()

    const [lpApprovedAmount, setLPApprovedAmount] = useState(new BigNumber(0))
    const [lockFee, setLockFee] = useState(0)
    const [lockedRecords, setLockedRecords] = useState([])
    const [lpBalance, setLPBalance] = useState()
    const [lpSymbol, setLPSymbol] = useState('')
    const [lpTotalBalance, setLPTotalBalance] = useState(new BigNumber(0))
    const [lpLockedBalance, setLPLockedBalance] = useState(new BigNumber(0))

    useEffect(() => {
        let ac = new AbortController()

        if (token?.length > 0) {
            getTokenApprovedAmount(token, wallet.address, ADDRESSES[chainId].locker)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setLPApprovedAmount(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            getLockedRecords(token)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setLockedRecords(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            getFeeAmount(wallet.address)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setLockFee(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            balanceOf(token, wallet.address)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setLPBalance(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                    setLPBalance(undefined)
                })

            balanceOf(token, ADDRESSES[chainId].locker)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setLPLockedBalance(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                    setLPBalance(undefined)
                })

            getTokenSupply(token)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setLPTotalBalance(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                    setLPBalance(undefined)
                })

            getTokenSymbol(token)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setLPSymbol(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }

        return () => ac.abort()
    }, [token, getTokenApprovedAmount, getLockedRecords, getFeeAmount, balanceOf, getTokenSupply, getTokenSymbol,
        chainId, wallet.address, reloadCounter])

    const handleApproveLP = useCallback(async () => {
        showLoading('Approving...')
        approveToken(token, ADDRESSES[chainId].locker)
            .then(tx => {
                toastSuccess('Approve', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Approve', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, approveToken, token, chainId, refreshPages])

    const handleLock = useCallback(async (lpAmount, ethFee, period) => {
        if (lpAmount === '' || isNaN(parseFloat(lpAmount)) || parseFloat(lpAmount) === 0) {
            toastError("Lock", "Please input valid LP amount")
            return
        }
        if (isNaN(period) || period < 7 * 86400) {
            toastError("Lock", "Please input valid date. Minimum lock period is 7 days")
            return
        }

        showLoading('Locking LP...')
        lockLP(token, lpAmount, ethFee, period)
            .then(tx => {
                toastSuccess('Lock', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Lock', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, lockLP, token, refreshPages])

    const handleUnlock = useCallback(async (lockIndex, lpAmount) => {
        showLoading('Unlocking LP...')
        unlockLP(token, lockIndex, lpAmount)
            .then(tx => {
                toastSuccess('Unlock', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Unlock', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, unlockLP, token, refreshPages])

    return {
        lpApprovedAmount, lockFee, lockedRecords, lpBalance, lpLockedBalance, lpTotalBalance, lpSymbol,
        handleApproveLP, handleLock, handleUnlock
    }
}

export default useLockContext