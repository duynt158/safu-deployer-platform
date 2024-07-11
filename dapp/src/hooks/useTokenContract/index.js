import { useState, useEffect, useCallback } from "react"
import { useContract } from "../../contexts/ContractContext"
import { useGlobal } from "../../contexts/GlobalContext"
import { useCustomWallet } from "../../contexts/WalletContext"
import useToast from "../useToast"
import ADDRESSES from '../../contexts/ContractContext/address'
import BigNumber from "bignumber.js"

const useTokenContract = (token) => {
    const { chainId } = useGlobal()
    const { showLoading, hideLoading, toastSuccess, toastError } = useToast()
    const { wallet, isLoggedIn } = useCustomWallet()
    const { reloadCounter, refreshPages, getTemplateId, getTokenName, getTokenSymbol, getTokenSupply, balanceOf, getOwner, getPairAddress, getFeeRxWallets,
        transferOwnership, renounceOwnership, updateMarketingWallet, updateMaxTxAmount, updateMaxWalletAmount, getDeployedHistory,
        updateSellTax, addToLP, updateMarketingWalletT2, updateMaxTxAmountT2, updateMaxWalletAmountT2,
        updateBuySellTaxT2, updateFeeDistributionT2, balanceETH, getTokenApprovedAmount, approveToken, getFeeAmount,
        isLockerEnabledT1, enableLockerT1, isLockerEnabledT2, enableLockerT2 } = useContract()

    const [templateId, setTemplateId] = useState()
    const [tokenName, setTokenName] = useState('')
    const [tokenSymbol, setTokenSymbol] = useState('')
    const [tokenSupply, setTokenSupply] = useState(new BigNumber(0))
    const [tokenBalance, setTokenBalance] = useState(new BigNumber(0))
    const [ethBalance, setETHBalance] = useState(0)
    const [owner, setOwner] = useState('')
    const [lpAddress, setLPAddress] = useState('')
    const [deployedHistory, setDeployedHistory] = useState([])
    const [deployerOwner, setDeployerOwner] = useState('')
    const [feeWallets, setFeeWallets] = useState([])
    const [lockApprovedAmount, setLockApprovedAmount] = useState(new BigNumber(0))

    const [lockerEnabledT1, setLockerEnabledT1] = useState(false)
    const [lockerEnabledT2, setLockerEnabledT2] = useState(false)

    useEffect(() => {
        let ac = new AbortController()

        if (token !== undefined) {
            getTemplateId(token)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setTemplateId(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                    if (isLoggedIn() !== true) {
                        setTemplateId(-1)
                    } else {
                        setTemplateId(0)
                    }
                })

            getTokenName(token)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setTokenName(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            getTokenSymbol(token)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setTokenSymbol(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            getTokenSupply(token)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setTokenSupply(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            balanceOf(token, wallet.address)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setTokenBalance(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            balanceETH(wallet.address)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setETHBalance(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            getOwner(token)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setOwner(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            getOwner(ADDRESSES[chainId].deployer)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setDeployerOwner(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            getPairAddress(token)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setLPAddress(r)
                    }
                })
                .catch(err => {
                    setLPAddress(undefined)
                    console.log(err)
                })

            getDeployedHistory()
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setDeployedHistory(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            getFeeRxWallets()
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setFeeWallets(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            getTokenApprovedAmount(token, wallet.address, ADDRESSES[chainId].locker)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setLockApprovedAmount(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            isLockerEnabledT1(token)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setLockerEnabledT1(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            isLockerEnabledT2(token)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setLockerEnabledT2(r)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }

        return () => ac.abort()
    }, [token, reloadCounter, getTemplateId, getTokenName, getTokenSymbol, getTokenSupply, getPairAddress, getTokenApprovedAmount,
        balanceOf, getOwner, getDeployedHistory, getFeeRxWallets, getFeeAmount, balanceETH, isLockerEnabledT1, isLockerEnabledT2, 
        wallet.address, isLoggedIn, chainId])

    const handleTransferOwnership = useCallback(async (to) => {
        showLoading('Transferring ownership...')
        transferOwnership(token, to)
            .then(tx => {
                toastSuccess('Ownership', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Ownership', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, transferOwnership, token, refreshPages])

    const handleRenounceOwnership = useCallback(async () => {
        showLoading('Renoucing ownership...')
        renounceOwnership(token)
            .then(tx => {
                toastSuccess('Ownership', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Ownership', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, renounceOwnership, token, refreshPages])

    const handleUpdateMarketingWallet = useCallback(async (newAddress) => {
        showLoading('Updating...')
        updateMarketingWallet(token, newAddress)
            .then(tx => {
                toastSuccess('Marketing', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Marketing', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, updateMarketingWallet, token, refreshPages])

    const handleUpdateMaxTxPercentage = useCallback(async (newTxAmount) => {
        showLoading('Updating...')
        updateMaxTxAmount(token, newTxAmount)
            .then(tx => {
                toastSuccess('Max Tx', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Max Tx', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, updateMaxTxAmount, token, refreshPages])

    const handleUpdateMaxTxPercentageT2 = useCallback(async (newTxPercentage) => {
        showLoading('Updating...')
        updateMaxTxAmountT2(token, newTxPercentage)
            .then(tx => {
                toastSuccess('Max Tx', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Max Tx', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, updateMaxTxAmountT2, token, refreshPages])

    const handleUpdateMaxWalletPercentage = useCallback(async (newWalletAmount) => {
        showLoading('Updating...')
        updateMaxWalletAmount(token, newWalletAmount)
            .then(tx => {
                toastSuccess('Max Wallet', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Max Wallet', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, updateMaxWalletAmount, token, refreshPages])

    const handleUpdateSellTax = useCallback(async (buyback, marketing) => {
        showLoading('Updating...')
        updateSellTax(token, buyback, marketing)
            .then(tx => {
                toastSuccess('Sell Tax', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Sell Tax', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, updateSellTax, token, refreshPages])

    const handleAddToLP = useCallback(async (tokenAmount, ethAmount, period) => {
        showLoading('Adding to LP & Lock...')
        addToLP(token, tokenAmount, ethAmount, period)
            .then(tx => {
                toastSuccess('LP', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('LP', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, addToLP, token, refreshPages])

    const handleApprove = useCallback(async () => {
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

    const handleUpdateMarketingWalletT2 = useCallback(async (newAddress) => {
        showLoading('Updating...')
        updateMarketingWalletT2(token, newAddress)
            .then(tx => {
                toastSuccess('Marketing', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Marketing', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, updateMarketingWalletT2, token, refreshPages])

    const handleUpdateMaxWalletPercentageT2 = useCallback(async (newWalletPercentage) => {
        showLoading('Updating...')
        updateMaxWalletAmountT2(token, newWalletPercentage)
            .then(tx => {
                toastSuccess('Max Wallet', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Max Wallet', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, updateMaxWalletAmountT2, token, refreshPages])

    const handleBuySellTaxT2 = useCallback(async (buyFee, sellFee) => {
        showLoading('Updating...')
        updateBuySellTaxT2(token, buyFee, sellFee)
            .then(tx => {
                toastSuccess('Tax', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Tax', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, updateBuySellTaxT2, token, refreshPages])

    const handleFeeDistributionT2 = useCallback(async (marketing, dividend) => {
        showLoading('Updating...')
        updateFeeDistributionT2(token, marketing, dividend)
            .then(tx => {
                toastSuccess('Fee Distribution', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Fee Distribution', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, updateFeeDistributionT2, token, refreshPages])

    const handleEnableLockerT1 = useCallback(async () => {
        showLoading('Enabling Locker...')
        enableLockerT1(token)
            .then(tx => {
                toastSuccess('Locker', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Locker', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, enableLockerT1, token, refreshPages])

    const handleEnableLockerT2 = useCallback(async () => {
        showLoading('Enabling Locker...')
        enableLockerT2(token)
            .then(tx => {
                toastSuccess('Locker', tx.transactionHash)
                refreshPages()
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Locker', err.message)
                hideLoading()
            })
    }, [toastError, toastSuccess, showLoading, hideLoading, enableLockerT2, token, refreshPages])

    return {
        templateId, tokenName, tokenSymbol, tokenSupply, tokenBalance, owner, lpAddress, deployedHistory, deployerOwner, feeWallets,
        ethBalance, lockApprovedAmount, lockerEnabledT1, lockerEnabledT2,
        handleTransferOwnership, handleRenounceOwnership, handleUpdateMarketingWallet, handleUpdateMaxTxPercentage, handleUpdateMaxWalletPercentage,
        handleUpdateSellTax, handleAddToLP, handleUpdateMarketingWalletT2, handleUpdateMaxTxPercentageT2, handleUpdateMaxWalletPercentageT2,
        handleBuySellTaxT2, handleFeeDistributionT2, handleApprove, handleEnableLockerT1, handleEnableLockerT2
    }
}

export default useTokenContract
