import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGlobal } from '../../../../contexts/GlobalContext'
import { useCustomWallet } from '../../../../contexts/WalletContext'
import useTokenContract from "../../../../hooks/useTokenContract"
import walletConfig from '../../../../contexts/WalletContext/config'

const Template2 = ({ token, tokenOwner }) => {
    const { chainId } = useGlobal()
    const { wallet } = useCustomWallet()
    const { handleTransferOwnership, handleRenounceOwnership, handleUpdateMarketingWalletT2,
        handleUpdateMaxTxPercentageT2, handleUpdateMaxWalletPercentageT2, handleBuySellTaxT2, handleFeeDistributionT2, lpAddress,
        lockerEnabledT2, handleEnableLockerT2 } = useTokenContract(token)
    const [owner, setOwner] = useState('')
    const [maxTx, setMaxTx] = useState('')
    const [maxWallet, setMaxWallet] = useState('')
    const [marketingWallet, setMarketingWallet] = useState('')
    const [buyFee, setBuyFee] = useState('')
    const [sellFee, setSellFee] = useState('')
    const [feeRateMarketing, setFeeRateMarketing] = useState('')
    const [feeRateDividend, setFeeRateDividend] = useState('')

    return (
        <>
            {
                wallet.address.toLowerCase() === tokenOwner.toLowerCase() ?
                    <div className="row">
                        <div className="col-12 col-md-4 single-staking-item input-box">
                            <span className="item-title mb-2">Ownership</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='0x...' value={owner} onChange={e => setOwner(e.target.value)} />
                                </div>
                                <div className="btn input-btn mt-2" onClick={() => handleTransferOwnership(owner)}>Transfer</div>
                                <div className="btn input-btn mt-2" onClick={() => handleRenounceOwnership()}>Renounce</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 single-staking-item input-box">
                            <span className="item-title mb-2">Marketing Wallet</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='0x...' value={marketingWallet} onChange={e => setMarketingWallet(e.target.value)} />
                                </div>
                                <div className="btn input-btn mt-2" onClick={() => handleUpdateMarketingWalletT2(marketingWallet)}>Update</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 single-staking-item input-box">
                            <span className="item-title mb-2">Max Tx(%)</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='1' value={maxTx} onChange={e => setMaxTx(e.target.value)} />
                                </div>
                                <div className="btn input-btn mt-2" onClick={() => handleUpdateMaxTxPercentageT2(maxTx)}>Update</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 single-staking-item input-box">
                            <span className="item-title mb-2">Max Wallet(%)</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='1' value={maxWallet} onChange={e => setMaxWallet(e.target.value)} />
                                </div>
                                <div className="btn input-btn mt-2" onClick={() => handleUpdateMaxWalletPercentageT2(maxWallet)}>Update</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 single-staking-item input-box">
                            <span className="item-title mb-2">Buy Fee(%)</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='10' value={buyFee} onChange={e => setBuyFee(e.target.value)} />
                                </div>
                            </div>
                            <span className="item-title mb-2 mt-4">Sell Fee(%)</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='20' value={sellFee} onChange={e => setSellFee(e.target.value)} />
                                </div>
                                <div className="btn input-btn mt-2" onClick={() => handleBuySellTaxT2(buyFee, sellFee)}>Update</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 single-staking-item input-box">
                            <span className="item-title mb-2">Marketing Distribution(%)</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='40' value={feeRateMarketing} onChange={e => setFeeRateMarketing(e.target.value)} />
                                </div>
                            </div>
                            <span className="item-title mb-2 mt-4">Reflection Distribution(%)</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='60' value={feeRateDividend} onChange={e => setFeeRateDividend(e.target.value)} />
                                </div>
                                <div className="btn input-btn mt-2" onClick={() => handleFeeDistributionT2(feeRateMarketing, feeRateDividend)}>Update</div>
                            </div>
                        </div>
                        {/* <div className="col-12 col-md-4 single-staking-item input-box">
                            <span className="item-title mb-2">Add To LP - $Token</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='' value={addToLPToken} onChange={e => setAddToLPToken(e.target.value)} />
                                </div>
                            </div>
                            <span className="item-title mb-2 mt-4">Add To LP - $ETH</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='' value={addToLPETH} onChange={e => setAddToLPETH(e.target.value)} />
                                </div>
                                <div className="btn input-btn mt-2" onClick={() => handleAddToLP(addToLPToken, addToLPETH)}>Add To LP</div>
                            </div>
                        </div> */}
                        {/* <div className="col-12 col-md-4 single-staking-item input-box">
                            <span className="item-title mb-2">Withdraw</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder={0.00} />
                                    <a href="#">Max</a>
                                </div>
                                <a href="#" className="btn input-btn mt-2">Withdraw</a>
                            </div>
                        </div> */}
                        <div className="col-12 single-staking-item input-box">
                            <span className="item-title mb-2"></span>
                            <div className="input-area d-flex flex-column">
                                <h4 className="price m-0">Add/Lock LP</h4>
                                <span className="reward my-2">You may add or lock your LP token at our dapp or unicrypt.</span>
                                <a href={`${walletConfig[chainId].blockUrls[0]}token/${lpAddress}`} target='_blank' rel="noreferrer" style={{ color: 'white', textOverflow: 'ellipsis', overflow: 'hidden' }}>{lpAddress}</a>
                                {
                                    lockerEnabledT2 === true ?
                                        <Link to={`/liquidity/${token}`} className="btn input-btn mt-2"><i className="fa-solid fa-lock mr-1" /> LP Management</Link>
                                        :
                                        <div className='btn input-btn mt-2' onClick={handleEnableLockerT2}>Enable Locker <i className="fa-solid fa-lock mr-1" /></div>
                                }
                                <a href="https://app.unicrypt.network/amm/uni-v2/locker" target='_blank' rel="noreferrer" className="btn input-btn mt-2"><i className="fa-solid fa-lock mr-1" /> Unicrypt</a>
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        <h4>You are not the owner of this token</h4>
                        <div className='row'>
                            <div className="col-12 single-staking-item input-box">
                                <span className="item-title mb-2"></span>
                                <div className="input-area d-flex flex-column">
                                    <h4 className="price m-0">Add/Lock LP</h4>
                                    <span className="reward my-2">You may add or lock your LP token at our dapp or unicrypt.</span>
                                    <a href={`${walletConfig[chainId].blockUrls[0]}token/${lpAddress}`} target='_blank' rel="noreferrer" style={{ color: 'white', textOverflow: 'ellipsis', overflow: 'hidden' }}>{lpAddress}</a>
                                    <Link to={`/liquidity/${token}`} className="btn input-btn mt-2"><i className="fa-solid fa-lock mr-1" /> LP Management</Link>
                                    <a href="https://app.unicrypt.network/amm/uni-v2/locker" target='_blank' rel="noreferrer" className="btn input-btn mt-2"><i className="fa-solid fa-lock mr-1" /> Unicrypt</a>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </>
    )
}

export default Template2