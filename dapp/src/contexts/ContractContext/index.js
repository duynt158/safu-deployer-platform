import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { useCustomWallet } from "../WalletContext"
import ERC20_abi from './abi/ERC20.json'
import Router_abi from './abi/IPancakeRouter02.json'
import Factory_abi from './abi/IPancakeFactory.json'
import SafuDeployer_abi from './abi/SafuDeployer.json'
import SafuTemplate1_abi from './abi/SafuDeployerTemplate1.json'
import SafuTemplate2_abi from './abi/SafuDeployerTemplate2.json'
import Locker_abi from './abi/LPLocker.json'
import walletConfig from '../WalletContext/config'
import ADDRESS from './address'
import axios from 'axios'
import qs from 'qs'

import BigNumber from 'bignumber.js'
import { useGlobal } from "../GlobalContext"

const Web3 = require("web3")

export const ContractContext = createContext();

export const ContractProvider = (props) => {
    const { wallet } = useCustomWallet()
    const { chainId } = useGlobal()

    const [reloadCounter, setReloadCounter] = useState(0)
    const web3Provider = useMemo(() => { return new Web3(walletConfig[chainId].rpcUrls[0]) }, [chainId])

    const buildEncodedData = useCallback((types, values) => {
        var encoded = web3Provider.eth.abi.encodeParameters(types, values);
        if (encoded.slice(0, 2) === '0x') {
            encoded = encoded.slice(2)
        }
        return encoded
    }, [web3Provider])

    useEffect(() => {
        let ac = new AbortController();

        const reload = () => {
            setReloadCounter(t => { return t + 1 });
        }

        let tmr = setInterval(() => {
            if (ac.signal.aborted === false) {
                window.web3 && reload();
            }
        }, 60000);

        return () => {
            ac.abort();
            clearInterval(tmr);
        }
    }, [])

    useEffect(() => {
        setReloadCounter(t => { return t + 1 });
    }, [wallet])

    const refreshPages = () => {
        setTimeout(() => {
            setReloadCounter(t => { return t + 1 })
        }, 2000)
    }

    const assertValidAddress = useCallback((addr) => {
        if (!web3Provider.utils.isAddress(addr)) {
            throw new Error('Invalid Address')
        }
    }, [web3Provider])

    const makeTx = useCallback(async (addr, tx, gasPlus) => {
        const web3 = window.web3;
        web3.eth.getGasPrice()
        tx.estimateGas({ from: wallet.address })

        const [gasPrice, gasCost] = await Promise.all([
            web3.eth.getGasPrice(),
            tx.estimateGas({ from: wallet.address }),
        ]);
        const data = tx.encodeABI();
        const txData = {
            from: wallet.address,
            to: addr,
            data,
            gas: gasCost + (gasPlus !== undefined ? gasPlus : 0),
            gasPrice
        };
        const receipt = await web3.eth.sendTransaction(txData);
        return receipt;
    }, [wallet.address])

    const makeTxWithNativeCurrency = useCallback(async (addr, tx, nativeCurrencyAmount, gasPlus) => {
        const web3 = window.web3;

        const [gasPrice, gasCost] = await Promise.all([
            web3.eth.getGasPrice(),
            tx.estimateGas({
                value: nativeCurrencyAmount,
                from: wallet.address
            }),
        ]);
        const data = tx.encodeABI();
        const txData = {
            from: wallet.address,
            to: addr,
            value: nativeCurrencyAmount,
            data,
            gas: gasCost + (gasPlus !== undefined ? gasPlus : 0),
            gasPrice
        };
        const receipt = await web3.eth.sendTransaction(txData);
        return receipt;
    }, [wallet.address])

    const A2D = useCallback(async (addr, amount) => {
        const web3 = web3Provider
        assertValidAddress(addr)
        const erc20 = new web3.eth.Contract(ERC20_abi.abi, addr);

        let tval = await erc20.methods.decimals().call()
        let tt = new BigNumber(amount).div(new BigNumber(`1e${tval}`))
        return tt
    }, [web3Provider, assertValidAddress])

    const D2A = useCallback(async (addr, amount) => {
        const web3 = web3Provider;
        const toBN = web3.utils.toBN;
        assertValidAddress(addr)
        const erc20 = new web3.eth.Contract(ERC20_abi.abi, addr);
        let tval = await erc20.methods.decimals().call();
        tval = new BigNumber(amount).times(new BigNumber(`1e${tval}`))
        return toBN(tval.toFixed(0));
    }, [web3Provider, assertValidAddress])

    const balanceOf = useCallback(async (token, address) => {
        const web3 = web3Provider;

        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(ERC20_abi.abi, token);
        let ret = await tokenContract.methods.balanceOf(address).call();

        return await A2D(token, ret)
    }, [A2D, web3Provider, assertValidAddress])

    const balanceETH = useCallback(async (address) => {
        const web3 = web3Provider;

        assertValidAddress(address)
        const ret = await web3.eth.getBalance(address)

        return web3.utils.fromWei(ret)
    }, [web3Provider, assertValidAddress])

    const getTokenApprovedAmount = useCallback(async (token, owner, spender) => {
        const web3 = web3Provider;

        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(ERC20_abi.abi, token);
        let ret = await tokenContract.methods.allowance(owner, spender).call();

        return await A2D(token, ret)
    }, [A2D, web3Provider, assertValidAddress])

    const approveToken = useCallback(async (token, spender) => {
        const web3 = window.web3;

        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(ERC20_abi.abi, token);
        let tx = await makeTx(token, tokenContract.methods.approve(spender, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'));

        return tx;
    }, [makeTx, assertValidAddress])

    const transferOwnership = useCallback(async (ownable, newOwner) => {
        const web3 = window.web3;

        assertValidAddress(ownable)
        const ownableContract = new web3.eth.Contract(SafuDeployer_abi.abi, ownable);
        let tx = await makeTx(ownable,
            ownableContract.methods.transferOwnership(newOwner));

        return tx;
    }, [makeTx, assertValidAddress])

    const renounceOwnership = useCallback(async (ownable) => {
        const web3 = window.web3;

        assertValidAddress(ownable)
        const ownableContract = new web3.eth.Contract(SafuDeployer_abi.abi, ownable);
        let tx = await makeTx(ownable,
            ownableContract.methods.renounceOwnership());

        return tx;
    }, [makeTx, assertValidAddress])

    const getTemplateFee = useCallback(async (templateId) => {
        const web3 = web3Provider

        const deployerContract = new web3.eth.Contract(SafuDeployer_abi.abi, ADDRESS[chainId].deployer)
        const fee = await deployerContract.methods.feeTemplates(templateId).call()
        return web3.utils.fromWei(fee)
    }, [web3Provider, chainId])

    const getFeeRxWallets = useCallback(async (templateId) => {
        const web3 = web3Provider

        const deployerContract = new web3.eth.Contract(SafuDeployer_abi.abi, ADDRESS[chainId].deployer)
        let i
        let ret = []
        for (i = 0; ; i ++) {
            try {
                const wallet = await deployerContract.methods.feeWallets(i).call()
                ret = [...ret, wallet]
            } catch (err) {
                break;
            }
        }
        return ret
    }, [web3Provider, chainId])

    const getDeployedHistory = useCallback(async () => {
        const web3 = web3Provider

        const deployerContract = new web3.eth.Contract(SafuDeployer_abi.abi, ADDRESS[chainId].deployer)
        const history = await deployerContract.methods.getDeployHistory().call()

        return history.map(h => {
            return {
                ...h,
                c: {
                    cost: web3.utils.fromWei(h.cost.toString())
                }
            }
        })
    }, [web3Provider, chainId])

    const getTemplateId = useCallback(async (token) => {
        const web3 = web3Provider
        assertValidAddress(token)
        const deployerContract = new web3.eth.Contract(SafuTemplate1_abi.abi, token)
        const idPrefix = 'Safu Smart Deployer Template '

        try {
            let id = await deployerContract.methods.identifier().call()
            if (id.slice(0, idPrefix.length) === idPrefix) {
                return parseInt(id.slice(idPrefix.length))
            }
        } catch (err) {
            console.log(err)
        }
        return 0
    }, [web3Provider, assertValidAddress])

    const getTokenName = useCallback(async (token) => {
        const web3 = web3Provider
        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(ERC20_abi.abi, token)
        return await tokenContract.methods.name().call()
    }, [web3Provider, assertValidAddress])

    const getTokenSymbol = useCallback(async (token) => {
        const web3 = web3Provider
        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(ERC20_abi.abi, token)
        return await tokenContract.methods.symbol().call()
    }, [web3Provider, assertValidAddress])

    const getTokenSupply = useCallback(async (token) => {
        const web3 = web3Provider
        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(ERC20_abi.abi, token)
        return await A2D(token, await tokenContract.methods.totalSupply().call())
    }, [web3Provider, A2D, assertValidAddress])

    const getOwner = useCallback(async (token) => {
        const web3 = web3Provider
        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(SafuTemplate1_abi.abi, token)
        return await tokenContract.methods.owner().call()
    }, [web3Provider, assertValidAddress])

    const getPairAddress = useCallback(async (token) => {
        const web3 = web3Provider
        assertValidAddress(token)
        const routerContract = new web3.eth.Contract(Router_abi.abi, ADDRESS[chainId].router)
        let factory = await routerContract.methods.factory().call()
        let wethAddress = await routerContract.methods.WETH().call()

        const factoryContract = new web3.eth.Contract(Factory_abi.abi, factory)
        return await factoryContract.methods.getPair(wethAddress, token).call()
    }, [web3Provider, assertValidAddress, chainId])

    const updateMarketingWallet = useCallback(async (token, newAddress) => {
        const web3 = window.web3;

        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(SafuTemplate1_abi.abi, token);
        let tx = await makeTx(token,
            tokenContract.methods.changeMarketingWallet(newAddress));

        return tx;
    }, [makeTx, assertValidAddress])

    const updateMaxTxAmount = useCallback(async (token, maxTxAmount) => {
        const web3 = window.web3;

        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(SafuTemplate1_abi.abi, token);
        let tx = await makeTx(token,
            tokenContract.methods.changeMaxTxAmount(await D2A(token, maxTxAmount)));

        return tx;
    }, [makeTx, D2A, assertValidAddress])

    const updateMaxWalletAmount = useCallback(async (token, maxWalletAmount) => {
        const web3 = window.web3;

        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(SafuTemplate1_abi.abi, token);
        let tx = await makeTx(token,
            tokenContract.methods.changeMaxWalletAmount(await D2A(token, maxWalletAmount)));

        return tx;
    }, [makeTx, D2A, assertValidAddress])

    const updateSellTax = useCallback(async (token, buyback, marketing) => {
        const web3 = window.web3;

        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(SafuTemplate1_abi.abi, token);
        let tx = await makeTx(token,
            tokenContract.methods.changeTaxForLiquidityAndMarketing(BigNumber(buyback).times(100).toFixed(0), BigNumber(marketing).times(100).toFixed(0)));

        return tx;
    }, [makeTx, assertValidAddress])

    const updateMarketingWalletT2 = useCallback(async (token, newAddress) => {
        const web3 = window.web3;

        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(SafuTemplate2_abi.abi, token);
        let tx = await makeTx(token,
            tokenContract.methods.setWalletAddresses('0x2C0D829bf475FE455944Dd60c8F4CE369d56d665', '0x0000000000000000000000000000000000000000', newAddress));

        return tx;
    }, [makeTx, assertValidAddress])

    const updateMaxTxAmountT2 = useCallback(async (token, maxTxPercentage) => {
        const web3 = window.web3;

        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(SafuTemplate2_abi.abi, token);
        let tx = await makeTx(token,
            tokenContract.methods.setMaxBuyAmount(BigNumber(maxTxPercentage).times(100).toFixed(0)));

        return tx;
    }, [makeTx, assertValidAddress])

    const updateMaxWalletAmountT2 = useCallback(async (token, maxWalletPercentage) => {
        const web3 = window.web3;

        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(SafuTemplate2_abi.abi, token);
        let tx = await makeTx(token,
            tokenContract.methods.setMaxWalletAmount(BigNumber(maxWalletPercentage).times(100).toFixed(0)));

        return tx;
    }, [makeTx, assertValidAddress])

    const updateBuySellTaxT2 = useCallback(async (token, buyFee, sellFee) => {
        const web3 = window.web3;

        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(SafuTemplate2_abi.abi, token);
        let tx = await makeTx(token,
            tokenContract.methods.setTaxFees(BigNumber(buyFee).times(100).toFixed(0), BigNumber(sellFee).times(100).toFixed(0), 0));

        return tx;
    }, [makeTx, assertValidAddress])

    const updateFeeDistributionT2 = useCallback(async (token, marketing, dividend) => {
        const web3 = window.web3;

        assertValidAddress(token)
        const tokenContract = new web3.eth.Contract(SafuTemplate2_abi.abi, token);
        let tx = await makeTx(token,
            tokenContract.methods.setDistribution(BigNumber(dividend).times(100).toFixed(0), 0, BigNumber(marketing).times(100).toFixed(0), 0));

        return tx;
    }, [makeTx, assertValidAddress])

    const isAddressFormat = useCallback((addr) => {
        return web3Provider.utils.isAddress(addr)
    }, [web3Provider])

    const verifyContract = useCallback(async (token, templateId, creator, param) => {
        let constructorParam = buildEncodedData(["address", "bytes"], [creator, param])

        const fileContent = await (await fetch(`/contracts/${walletConfig[chainId].network}/Template${templateId}.sol`)).text()

        const data = {
            'apikey': walletConfig[chainId].apiKey,
            'module': 'contract',
            'action': 'verifysourcecode',
            'contractaddress': token,
            'sourceCode': fileContent,
            'codeformat': 'solidity-single-file',
            'contractname': `SafuDeployerTemplate${templateId}`,
            'compilerversion': 'v0.8.16+commit.07a7930e',
            'optimizationused': 1,
            'runs': 200,
            'evmVersion': '',
            'licenseType': 3,
            'constructorArguements': constructorParam,
        }

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: walletConfig[chainId].apiUrl
        }

        let result = await axios(options)
        return result.data
    }, [buildEncodedData, chainId])

    const deployTemplate1 = useCallback(async (name, symbol, decimals, supply, taxForLiquidity,
        taxForMarketing, maxTx, maxWallet, marketingWallet, sellToLP, sellToETH, fee) => {
        let callParam1 = buildEncodedData(
            ["uint256", "address", "uint256", "uint256"],
            [BigNumber(maxWallet).times(100).toFixed(0), marketingWallet, BigNumber(sellToLP).times(100).toFixed(0), BigNumber(sellToETH).times(100).toFixed(0)]
        )
        let callParam2 = buildEncodedData(
            ["address", "uint256", "uint256", "uint256", "bytes"],
            [ADDRESS[chainId].router, BigNumber(taxForLiquidity).times(100).toFixed(0), BigNumber(taxForMarketing).times(100).toFixed(0), BigNumber(maxTx).times(100).toFixed(0), "0x" + callParam1]
        )
        let callParam = buildEncodedData(
            ["string", "string", "uint8", "uint256", "bytes"],
            [name, symbol, decimals, supply, "0x" + callParam2]
        )

        const web3 = window.web3

        const deployerContract = new web3.eth.Contract(SafuDeployer_abi.abi, ADDRESS[chainId].deployer)

        let oldHistory = await deployerContract.methods.getDeployHistory().call()

        await makeTxWithNativeCurrency(ADDRESS[chainId].deployer,
            deployerContract.methods.deploy(1, "0x" + callParam, "0x00"), web3.utils.toWei(fee))
        
        let newHistory = await deployerContract.methods.getDeployHistory().call()
        let newCreated = newHistory.filter(n => oldHistory.find(o => o.id === n.id) === undefined).find(n => n.creator.toLowerCase() === wallet.address.toLowerCase())
        if (newCreated !== undefined) {
            // wait 10 seconds
            await new Promise((r) => {
                setTimeout(() => {
                    r()
                }, 10000)
            })

            try {
                console.log(await verifyContract(newCreated.deployedAddress, parseInt(newCreated.template.toString()), newCreated.creator, newCreated.param))
            } catch (err) {
                console.log(err.message)
            }
        }

        return newCreated?.deployedAddress;
    }, [makeTxWithNativeCurrency, buildEncodedData, chainId, wallet.address, verifyContract])

    const deployTemplate2 = useCallback(async (name, symbol, decimals, supply,
        swapAndLiquifyEnabled, isTaxFreeTransfer, maxBuy, maxWallet, swapLimit, sellLimit, buyBackAddress, marketingAddress, gasForProcessing,
        buyFee, sellFee, largeSellFee, distMarketing, distDividend, distBuyback,
        _dividendName, _dividendSymbol, minBalanceForDistribution, claimWait, fee) => {
        const web3 = window.web3

        console.log(name, symbol, decimals, supply,
            swapAndLiquifyEnabled, isTaxFreeTransfer, maxBuy, maxWallet, swapLimit, sellLimit, buyBackAddress, marketingAddress, gasForProcessing,
            buyFee, sellFee, largeSellFee, distMarketing, distDividend, distBuyback,
            _dividendName, _dividendSymbol, minBalanceForDistribution, claimWait, fee)

        if (!BigNumber(distMarketing).plus(BigNumber(distBuyback)).plus(BigNumber(distDividend)).lte(100)) {
            throw new Error("Distribution is invalid")
        }

        let auxParam = buildEncodedData(
            ["string", "string", "uint256", "uint256"],
            [_dividendName, _dividendSymbol, BigNumber(minBalanceForDistribution).times(BigNumber(`1e${decimals}`)).toFixed(0), claimWait]
        )

        let callParam3 = buildEncodedData(
            ["uint256", "uint256", "uint256", "uint256"],
            [0, BigNumber(distMarketing).times(100).toFixed(0), BigNumber(distDividend).times(100).toFixed(0), BigNumber(distBuyback).times(100).toFixed(0)]
        )
        let callParam4 = buildEncodedData(
            ["uint256", "uint256", "uint256", "bytes"],
            [BigNumber(buyFee).times(100).toFixed(0), BigNumber(sellFee).times(100).toFixed(0), BigNumber(largeSellFee).times(100).toFixed(0), "0x" + callParam3]
        )
        let callParam5 = buildEncodedData(
            ["address", "address", "uint256", "bytes"],
            [marketingAddress, '0x2C0D829bf475FE455944Dd60c8F4CE369d56d665', gasForProcessing, "0x" + callParam4]
        )
        let callParam6 = buildEncodedData(
            ["uint256", "uint256", "uint256", "address", "bytes"],
            [BigNumber(maxWallet).times(100).toFixed(0), web3.utils.toWei(swapLimit), web3.utils.toWei(sellLimit), buyBackAddress, "0x" + callParam5]
        )
        let callParam7 = buildEncodedData(
            ["address", "bool", "bool", "uint256", "bytes"],
            [ADDRESS[chainId].router, swapAndLiquifyEnabled, isTaxFreeTransfer, BigNumber(maxBuy).times(100).toFixed(0), "0x" + callParam6]
        )
        let callParam = buildEncodedData(
            ["string", "string", "uint8", "uint256", "bytes"],
            [name, symbol, decimals, supply, "0x" + callParam7]
        )

        const deployerContract = new web3.eth.Contract(SafuDeployer_abi.abi, ADDRESS[chainId].deployer)

        let oldHistory = await deployerContract.methods.getDeployHistory().call()

        let tx = await makeTxWithNativeCurrency(ADDRESS[chainId].deployer,
            deployerContract.methods.deploy(2, "0x" + callParam, '0x' + auxParam), web3.utils.toWei(fee))

        let newHistory = await deployerContract.methods.getDeployHistory().call()
        let newCreated = newHistory.filter(n => oldHistory.find(o => o.id === n.id) === undefined).find(n => n.creator.toLowerCase() === wallet.address.toLowerCase())

        if (newCreated !== undefined) {
            // wait 10 seconds
            await new Promise((r) => {
                setTimeout(() => {
                    r()
                }, 10000)
            })

            try {
                console.log(await verifyContract(newCreated.deployedAddress, parseInt(newCreated.template.toString()), newCreated.creator, newCreated.param))
            } catch (err) {
                console.log(err.message)
            }
            /*
            {
                message: "NOTOK",
                result: "Unable to locate ContractCode at 0x37cA3c91E568994564eB63ddC227b287699c363A",
                status: "0"
            }
            */
        }

        return newCreated?.deployedAddress;
    }, [makeTxWithNativeCurrency, buildEncodedData, chainId, wallet.address, verifyContract])

    const getFeeAmount = useCallback(async (account) => {
        const web3 = web3Provider

        const lockerContract = new web3.eth.Contract(Locker_abi.abi, ADDRESS[chainId].locker)
        const isFeeExempt = await lockerContract.methods.isFeeExempt(account).call()

        if (isFeeExempt === true) return 0
        else {
            const feeAmount = await lockerContract.methods.lockFee().call()
            return web3.utils.fromWei(feeAmount)
        }
    }, [web3Provider, chainId])

    const getLockedRecords = useCallback(async (lp) => {
        const web3 = web3Provider

        const lockerContract = new web3.eth.Contract(Locker_abi.abi, ADDRESS[chainId].locker)
        const arr = await lockerContract.methods.getLockTotalInfo(wallet.address, lp).call()

        let ret = []
        let id = 0
        for (let a of arr.info) {
            const locked = new Date(parseInt(a.lockTime) * 1000)
            const expired = new Date(parseInt(a.expireTime) * 1000)
            const lockedString = locked.toLocaleDateString() + ' ' + locked.toLocaleTimeString()
            const expiredString = expired.toLocaleDateString() + ' ' + expired.toLocaleTimeString()
            const ls = lockedString.split(/[\s/ :]+/)
            const es = expiredString.split(/[\s/ :]+/)
            const expiredFlag = parseInt(arr.now) > parseInt(a.expireTime)
            const validFlag = parseInt(a.lockTime) !== 0
            
            id ++
            if (validFlag === true) {
                ret = [...ret, {
                    ...a,
                    id: id,
                    c: {
                        amount: await A2D(lp, a.amount),
                        duration: parseInt(a.expireTime) - parseInt(a.lockTime),
                        elapsed: parseInt(arr.now) - parseInt(a.lockTime),
                        locked: `${ls[2]}/${ls[0]}/${ls[1]} ${ls[3]}:${ls[4]}:${ls[5]} ${ls[6]}`,
                        until: expiredFlag === true? '': `${es[2]}/${es[0]}/${es[1]} ${es[3]}:${es[4]}:${es[5]} ${es[6]}`
                    }
                }]
            }
        }

        return ret
    }, [web3Provider, wallet.address, chainId, A2D])

    const addToLP = useCallback(async (token, tokenAmount, ethAmount, lockPeriod) => {
        const web3 = window.web3;
        let lockerAddress = ADDRESS[chainId].locker

        const lockerContract = new web3.eth.Contract(Locker_abi.abi, lockerAddress)
        let tx = await makeTxWithNativeCurrency(lockerAddress,
            lockerContract.methods.addToLPAndLock(token, wallet.address, await D2A(token, tokenAmount), lockPeriod), web3.utils.toWei(ethAmount))

        return tx;
    }, [makeTxWithNativeCurrency, chainId, D2A, wallet.address])

    const lockLP = useCallback(async (lp, lpAmount, ethFee, lockPeriod) => {
        const web3 = window.web3;
        let lockerAddress = ADDRESS[chainId].locker

        const bigAmount = await D2A(lp, lpAmount)

        const lockerContract = new web3.eth.Contract(Locker_abi.abi, lockerAddress)
        let tx = await makeTxWithNativeCurrency(lockerAddress,
            lockerContract.methods.lock(lp, wallet.address, bigAmount.toString(), lockPeriod.toString()), web3.utils.toWei(ethFee.toString()))

        return tx;
    }, [makeTxWithNativeCurrency, chainId, D2A, wallet.address])

    const unlockLP = useCallback(async (lp, lockIndex, amount) => {
        const web3 = window.web3;
        let lockerAddress = ADDRESS[chainId].locker

        const lockerContract = new web3.eth.Contract(Locker_abi.abi, lockerAddress)
        let realAmount = await D2A(lp, amount)

        let tx = await makeTx(lockerAddress,
            lockerContract.methods.unlock(lp, lockIndex, realAmount))

        return tx;
    }, [makeTx, chainId, D2A])

    const isLockerEnabledT1 = useCallback(async (token) => {
        const web3 = web3Provider

        const tokenContract = new web3.eth.Contract(SafuTemplate1_abi.abi, token)
        const ret = await tokenContract.methods.isFeeExempt(ADDRESS[chainId].locker).call()
        return ret
    }, [web3Provider, chainId])

    const enableLockerT1 = useCallback(async (token) => {
        const web3 = window.web3;
        let lockerAddress = ADDRESS[chainId].locker

        const tokenContract = new web3.eth.Contract(SafuTemplate1_abi.abi, token)

        let tx = await makeTx(token,
            tokenContract.methods.updateFeeExempt([lockerAddress], true))

        return tx;
    }, [makeTx, chainId])

    const isLockerEnabledT2 = useCallback(async (token) => {
        const web3 = web3Provider

        const tokenContract = new web3.eth.Contract(SafuTemplate2_abi.abi, token)
        const ret = await tokenContract.methods.isExcludedFromFee(ADDRESS[chainId].locker).call()
        return ret
    }, [web3Provider, chainId])

    const enableLockerT2 = useCallback(async (token) => {
        const web3 = window.web3;
        let lockerAddress = ADDRESS[chainId].locker

        const tokenContract = new web3.eth.Contract(SafuTemplate2_abi.abi, token)

        let tx = await makeTx(token,
            tokenContract.methods.excludeIncludeFromFee([lockerAddress], true))

        return tx;
    }, [makeTx, chainId])

    return (
        <ContractContext.Provider value={{
            reloadCounter, refreshPages, makeTx, makeTxWithNativeCurrency,
            A2D, D2A, balanceOf, getTokenApprovedAmount, approveToken, balanceETH,
            transferOwnership, renounceOwnership, deployTemplate1, getTemplateFee, deployTemplate2, getDeployedHistory,
            getTemplateId, getTokenName, getTokenSymbol, getTokenSupply, getOwner, getFeeRxWallets,
            updateMarketingWallet, updateMaxTxAmount, updateMaxWalletAmount, updateSellTax,
            addToLP, updateMarketingWalletT2, updateMaxTxAmountT2, updateMaxWalletAmountT2,
            updateBuySellTaxT2, updateFeeDistributionT2, getPairAddress, isAddressFormat, buildEncodedData,
            verifyContract, lockLP, getFeeAmount, getLockedRecords, unlockLP, isLockerEnabledT1, enableLockerT1,
            isLockerEnabledT2, enableLockerT2
        }}>
            {props.children}
        </ContractContext.Provider>
    )
}

export const useContract = () => {
    const contractManager = useContext(ContractContext)
    return contractManager || [{}, async () => { }]
}
