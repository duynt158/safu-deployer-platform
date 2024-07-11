import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useContract } from '../../contexts/ContractContext';
import { useGlobal } from '../../contexts/GlobalContext';
import { useCustomWallet } from '../../contexts/WalletContext';
import useToast from '../../hooks/useToast';

const TemplateTwo = () => {
    const { TemplateName } = useGlobal()
    const { isLoggedIn } = useCustomWallet()

    const [data, setData] = useState({
        balance: "0.24 ETH",
        content: "Once deployed, you can use token as a normal one, adding to the liquidity of uniswap, distributing to the holders according to the tokenomics ...",
        heading: `Deploy ${TemplateName[1]}`,
        note: '*Mostly used token'
    })
    // const [tabData, setTabData] = useState([
    //     { id: 1, tabID: 'tab-one-tab', tabClass: 'tab-link active', tabLink: '#tab-one', title: '07 Days' },
    //     { id: 2, tabID: 'tab-two-tab', tabClass: 'tab-link', tabLink: '#tab-two', title: '14 Days' },
    //     { id: 3, tabID: 'tab-three-tab', tabClass: 'tab-link', tabLink: '#tab-three', title: '30 Days' },
    //     { id: 4, tabID: 'tab-four-tab', tabClass: 'tab-link', tabLink: '#tab-four', title: '60 Days' }
    // ])
    // const [tabContent, setTabContent] = useState([
    //     {
    //         apy: "0%",
    //         fee: "30%",
    //         id: 1,
    //         lock: "Yes",
    //         period: "7 Days",
    //         status: "Unlocked",
    //         tabClass: "tab-pane fade show active",
    //         tabID: "tab-one",
    //         tabLink: "tab-one"
    //     },
    //     {
    //         apy: "12%",
    //         fee: "30%",
    //         id: 2,
    //         lock: "Yes",
    //         period: "14 Days",
    //         status: "Unlocked",
    //         tabClass: "tab-pane fade",
    //         tabID: "tab-two",
    //         tabLink: "tab-two"
    //     },
    //     {
    //         apy: "25%",
    //         fee: "30%",
    //         id: 3,
    //         lock: "Yes",
    //         period: "30 Days",
    //         status: "Unlocked",
    //         tabClass: "tab-pane fade",
    //         tabID: "tab-three",
    //         tabLink: "tab-three"
    //     },
    //     {
    //         apy: "35%",
    //         fee: "30%",
    //         id: 4,
    //         lock: "No",
    //         period: "60 Days",
    //         status: "Unlocked",
    //         tabClass: "tab-pane fade",
    //         tabID: "tab-four",
    //         tabLink: "tab-four"
    //     }
    // ])

    const [features, setFeatures] = useState([
        { id: 1, title: '0', className: 'card no-hover staking-card', content: 'Totally Deployed' },
        { id: 2, title: '0 $ETH', className: 'card no-hover staking-card my-4', content: 'Fee' },
        { id: 3, title: '0', className: 'card no-hover staking-card', content: 'Number of Deployers' }
    ])

    const { reloadCounter, deployTemplate2, getTemplateFee, getDeployedHistory } = useContract()
    const { wallet } = useCustomWallet()
    const { numberFromStringComma, chainId } = useGlobal()
    const { toastError, toastSuccess, showLoading, hideLoading } = useToast()

    const [fee, setFee] = useState(0)

    const [name, setName] = useState('KISS Token 2')
    const [symbol, setSymbol] = useState('KT2')
    const [decimals] = useState("9")
    const [supply, setSupply] = useState("1,000,000,000")
    const [isReflectible] = useState(true)
    const [isFreeWhenTransfer] = useState(true)
    const [maxBuy, setMaxBuy] = useState(2)
    const [maxWallet, setMaxWallet] = useState(2)
    const [swapLimit] = useState('0.3')
    const [sellLimit] = useState('0')
    const [buyBackAddress] = useState('0x0000000000000000000000000000000000000000')
    const [marketingAddress, setMarketingAddress] = useState('')
    const [gasForProcessing] = useState('50000')
    const [buyFee, setBuyFee] = useState('10')
    const [sellFee, setSellFee] = useState('20')
    const [largeSellFee, setLargeSellFee] = useState('0')
    const [distMarketing, setDistMarketing] = useState('40')
    const [distDividend, setDistDividend] = useState('60')
    const [distBuyback] = useState('0')
    const [dividendName] = useState('KISS Dividend')
    const [dividendSymbol] = useState('KD')
    const [minBalanceForDistribution] = useState('0')
    const [claimWait] = useState('3600')

    const [history, setHistory] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        let ac = new AbortController()

        getTemplateFee(1)
            .then(r => {
                if (ac.signal.aborted === false) {
                    setFee(r)
                }
            })
            .catch(err => {
                console.log(err)
            })

        getDeployedHistory()
            .then(r => {
                if (ac.signal.aborted === false) {
                    setHistory(r)
                }
            })
            .catch(err => {
                console.log(err)
            })

        return () => ac.abort()
    }, [reloadCounter, getTemplateFee, getDeployedHistory])

    useEffect(() => {
        setMarketingAddress(wallet.address)
    }, [wallet.address])

    const handleDeploy = useCallback(async () => {
        if (parseFloat(buyFee) > 20) {
            toastError('Template 2', 'Buy Fee exceeds 20%')
            return
        }

        if (parseFloat(sellFee) > 20) {
            toastError('Template 2', 'Sell Fee exceeds 20%')
            return
        }

        showLoading('Deploy and verify automatically. And then redirecting to the admin page...')
        deployTemplate2(name, symbol, decimals, numberFromStringComma(supply), isReflectible, isFreeWhenTransfer,
            maxBuy, maxWallet, swapLimit, sellLimit, buyBackAddress, marketingAddress, gasForProcessing,
            buyFee, sellFee, largeSellFee, distMarketing, distDividend, distBuyback,
            dividendName, dividendSymbol, minBalanceForDistribution, claimWait, fee)
            .then(addr => {
                toastSuccess('Template 2', addr)
                navigate(`/search/${addr}`)
                hideLoading()
            })
            .catch(err => {
                console.log(`${err.message}`)
                toastError('Template 2', err.message)
                hideLoading()
            })
    }, [deployTemplate2, numberFromStringComma, name, symbol, decimals, supply, isReflectible, isFreeWhenTransfer,
        maxBuy, maxWallet, swapLimit, sellLimit, buyBackAddress, marketingAddress, gasForProcessing,
        buyFee, sellFee, largeSellFee, distMarketing, distDividend, distBuyback,
        dividendName, dividendSymbol, minBalanceForDistribution, claimWait, fee,
        toastError, toastSuccess, showLoading, hideLoading, navigate])

    useEffect(() => {
        setData(d => {
            return {
                ...d,
                balance: `${fee} $ETH`
            }
        })
        setFeatures(da => {
            return da.map(d => {
                return {
                    ...d,
                    title: d.content === 'Fee' ? `${fee} $ETH` : d.title
                }
            })
        })
    }, [fee])

    useEffect(() => {
        let deployedThis = history.filter(h => parseInt(h.template) === 2)
        let creators = deployedThis.map(h => h.creator).filter((v, i, a) => a.indexOf(v) === i)
        setFeatures(da => {
            return da.map(d => {
                return {
                    ...d,
                    title: d.content === 'Number of Deployers' ? `${creators.length}` : d.content === 'Totally Deployed' ? `${deployedThis.length}` : d.title
                }
            })
        })
    }, [history])

    return (
        <section className="staking-area">
            <div className="container">
                {
                    chainId === 42161 ?
                        <h3 className='text-center'>Not supported yet</h3>
                        :
                        <div className="row">
                            <div className="col-12 col-md-7">
                                <div className="card no-hover staking-card single-staking">
                                    <h3 className="m-0">{data.heading}</h3>
                                    <span className="balance">{data.balance}</span>
                                    {/* <ul className="nav nav-tabs staking-tabs border-0 my-3 my-md-4" id="myTab" role="tablist">
                                {tabData.map((item, idx) => {
                                    return (
                                        <li key={`std_${idx}`} className="nav-item" role="presentation">
                                            <a className={item.tabClass} id={item.tabID} data-toggle="tab" href={item.tabLink} role="tab" aria-selected="true">{item.title}</a>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="tab-content mt-md-3" id="myTabContent">
                                {tabContent.map((item, idx) => {
                                    return (
                                        <div key={`stcd_${idx}`} className={item.tabClass} id={item.tabID} role="tabpanel">
                                            <div className="staking-tab-content">
                                                <div className="info-box d-flex justify-content-between">
                                                    <div className="info-left">
                                                        <ul className="list-unstyled">
                                                            <li><strong>Lock period:</strong> {item.period}</li>
                                                            <li><strong>Extends lock on registration:</strong> {item.lock}</li>
                                                            <li><strong>Early unstake fee:</strong> {item.fee}</li>
                                                            <li><strong>Status:</strong> {item.status}</li>
                                                        </ul>
                                                    </div>
                                                    <div className="info-right d-flex flex-column">
                                                        <span>{item.apy}</span>
                                                        <span>APY*</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div> */}
                                    <div className="input-box my-4">
                                        {/* <div className="input-area d-flex flex-column flex-md-row mb-3">
                                    <div className="input-text">
                                        <input type="text" placeholder={0.00} />
                                        <a href="#">Max</a>
                                    </div>
                                    <a href="#" className="btn input-btn mt-2 mt-md-0 ml-md-3">{data.input_btn_1}</a>
                                </div> */}
                                        <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                            <div className='mr-3 input-label'>Name</div>
                                            <div className="input-text">
                                                <input type="text" placeholder='KISS Token 2' value={name} onChange={e => setName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                            <div className='mr-3 input-label'>Symbol</div>
                                            <div className="input-text">
                                                <input type="text" placeholder='KT2' value={symbol} onChange={e => setSymbol(e.target.value)} />
                                            </div>
                                        </div>
                                        {/* <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Decimals</div>
                                    <div className="input-text">
                                        <input type="text" placeholder='9' value={decimals} onChange={e => setDecimals(e.target.value)} />
                                    </div>
                                </div> */}
                                        <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                            <div className='mr-3 input-label'>Supply</div>
                                            <div className="input-text">
                                                <input type="text" placeholder='1,000,000,000' value={supply} onChange={e => setSupply(e.target.value)} />
                                            </div>
                                        </div>
                                        {/* <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Reflection Enabled?</div>
                                    <div className="input-text d-flex flex-row align-items-center justify-content-around">
                                        <div className={`p-2 ${isReflectible === true? 'bg-primary text-light rounded-top rounded-bottom': ''}`} style={{cursor: 'pointer'}} onClick={() => setIsReflectible(true)}>True</div>
                                        <div className={`p-2 ${isReflectible !== true? 'bg-primary text-light rounded-top rounded-bottom': ''}`} style={{cursor: 'pointer'}} onClick={() => setIsReflectible(false)}>False</div>
                                    </div>
                                </div>
                                <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Tax When Free Transfer?</div>
                                    <div className="input-text d-flex flex-row align-items-center justify-content-around">
                                        <div className={`p-2 ${isFreeWhenTransfer === true? 'bg-primary text-light rounded-top rounded-bottom': ''}`} style={{cursor: 'pointer'}} onClick={() => setIsFreeWhenTransfer(true)}>True</div>
                                        <div className={`p-2 ${isFreeWhenTransfer !== true? 'bg-primary text-light rounded-top rounded-bottom': ''}`} style={{cursor: 'pointer'}} onClick={() => setIsFreeWhenTransfer(false)}>False</div>
                                    </div>
                                </div> */}
                                        <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                            <div className='mr-3 input-label'>Max Transaction(%) (Max 5%)</div>
                                            <div className="input-text">
                                                <input type="text" placeholder='2' value={maxBuy} onChange={e => setMaxBuy(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                            <div className='mr-3 input-label'>Max Wallet(%) (Max 5%)</div>
                                            <div className="input-text">
                                                <input type="text" placeholder='1' value={maxWallet} onChange={e => setMaxWallet(e.target.value)} />
                                            </div>
                                        </div>
                                        {/* <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Swap Limit($ETH)</div>
                                    <div className="input-text">
                                        <input type="text" placeholder='0.3' value={swapLimit} onChange={e => setSwapLimit(e.target.value)} />
                                    </div>
                                </div> */}
                                        {/* <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Sell Limit($ETH)</div>
                                    <div className="input-text">
                                        <input type="text" placeholder='1' value={sellLimit} onChange={e => setSellLimit(e.target.value)} />
                                    </div>
                                </div> */}
                                        {/* <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Buyback Address</div>
                                    <div className="input-text">
                                        <input type="text" placeholder='0x...' value={buyBackAddress} onChange={e => setBuyBackAddress(e.target.value)} />
                                    </div>
                                </div> */}
                                        <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                            <div className='mr-3 input-label'>Marketing Address</div>
                                            <div className="input-text">
                                                <input type="text" placeholder='0x...' value={marketingAddress} onChange={e => setMarketingAddress(e.target.value)} />
                                            </div>
                                        </div>
                                        {/* <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Gas For Distribution</div>
                                    <div className="input-text">
                                        <input type="text" placeholder='50000' value={gasForProcessing} onChange={e => setGasForProcessing(e.target.value)} />
                                    </div>
                                </div> */}
                                        <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                            <div className='mr-3 input-label'>Buy Fee(%) (Max 20%)</div>
                                            <div className="input-text">
                                                <input type="text" placeholder='10' value={buyFee} onChange={e => setBuyFee(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                            <div className='mr-3 input-label'>Sell Fee(%) (Max 20%)</div>
                                            <div className="input-text">
                                                <input type="text" placeholder='20' value={sellFee} onChange={e => {
                                                    setSellFee(e.target.value)
                                                    setLargeSellFee(e.target.value)
                                                }}
                                                />
                                            </div>
                                        </div>
                                        {/* <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Large Sell Fee(%)</div>
                                    <div className="input-text">
                                        <input type="text" placeholder='30' value={largeSellFee} onChange={e => setLargeSellFee(e.target.value)} />
                                    </div>
                                </div> */}
                                        <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                            <div className='mr-3 input-label'>Distribution to Marketing(%)</div>
                                            <div className="input-text">
                                                <input type="text" placeholder='35' value={distMarketing} onChange={e => setDistMarketing(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                            <div className='mr-3 input-label'>Distribution to Dividend(%)</div>
                                            <div className="input-text">
                                                <input type="text" placeholder='60' value={distDividend} onChange={e => setDistDividend(e.target.value)} />
                                            </div>
                                        </div>
                                        {/* <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Distribution to Buyback(%)</div>
                                    <div className="input-text">
                                        <input type="text" placeholder='0' value={distBuyback} onChange={e => setDistBuyback(e.target.value)} />
                                    </div>
                                </div> */}
                                        {/* <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Dividend Name</div>
                                    <div className="input-text">
                                        <input type="text" placeholder='KISS Dividend' value={dividendName} onChange={e => setDividendName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Dividend Symbol</div>
                                    <div className="input-text">
                                        <input type="text" placeholder='KD' value={dividendSymbol} onChange={e => setDividendSymbol(e.target.value)} />
                                    </div>
                                </div> */}
                                        {/* <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Minimum Balance For Distribution</div>
                                    <div className="input-text">
                                        <input type="text" placeholder='0' value={minBalanceForDistribution} onChange={e => setMinBalanceForDistribution(e.target.value)} />
                                    </div>
                                </div>
                                <div className="input-area d-flex flex-column flex-md-row align-items-md-center mb-3">
                                    <div className='mr-3 input-label'>Claim Lock Period(s)</div>
                                    <div className="input-text">
                                        <input type="text" placeholder='3600' value={claimWait} onChange={e => setClaimWait(e.target.value)} />
                                    </div>
                                </div> */}
                                        <div className="input-area d-flex flex-column flex-md-row align-items-md-center">
                                            <div className="input-text">
                                            </div>
                                            <span className="btn input-btn mt-2 mt-md-0 ml-md-3" onClick={isLoggedIn() === true ? handleDeploy : () => navigate('/connect-wallet')}>Deploy</span>
                                        </div>
                                    </div>
                                    <span>{data.content}</span>
                                    <span className="mt-3"><strong>{data.note}</strong></span>
                                </div>
                            </div>
                            <div className="col-12 col-md-5">
                                <div className="staking-items mt-4 mt-md-0">
                                    {/* Single Card */}
                                    {features.map((item, idx) => {
                                        return (
                                            <div key={`fsd_${idx}`} className={item.className}>
                                                <h3 className="m-0">{item.title}</h3>
                                                <p>{item.content}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                }
            </div>
        </section>
    );
}

export default TemplateTwo;