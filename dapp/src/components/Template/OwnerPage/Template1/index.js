import { useState } from 'react'
import { useGlobal } from '../../../../contexts/GlobalContext'
import { useCustomWallet } from '../../../../contexts/WalletContext'
import useTokenContract from "../../../../hooks/useTokenContract"
import walletConfig from '../../../../contexts/WalletContext/config'
import { Link } from 'react-router-dom'

const Template1 = ({ token, tokenOwner }) => {
    const { numberFromStringComma, chainId } = useGlobal()
    const { wallet } = useCustomWallet()
    const { handleTransferOwnership, handleRenounceOwnership, handleUpdateMarketingWallet, handleUpdateMaxTxPercentage,
        handleUpdateMaxWalletPercentage, handleUpdateSellTax, lpAddress, lockerEnabledT1, handleEnableLockerT1 } = useTokenContract(token)
    const [owner, setOwner] = useState('')
    const [marketingWallet, setMarketingWallet] = useState('')
    const [maxTx, setMaxTx] = useState('')
    const [maxWallet, setMaxWallet] = useState('')
    const [sellTaxBuyback, setSellTaxBuyback] = useState('')
    const [sellTaxMarketing, setSellTaxMarketing] = useState('')

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
                                <div className="btn input-btn mt-2" onClick={() => handleUpdateMarketingWallet(marketingWallet)}>Update</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 single-staking-item input-box">
                            <span className="item-title mb-2">Max Tx - $Token</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='10,000,000' value={maxTx} onChange={e => setMaxTx(e.target.value)} />
                                </div>
                                <div className="btn input-btn mt-2" onClick={() => handleUpdateMaxTxPercentage(numberFromStringComma(maxTx))}>Update</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 single-staking-item input-box">
                            <span className="item-title mb-2">Max Wallet - $Token</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='10,000,000' value={maxWallet} onChange={e => setMaxWallet(e.target.value)} />
                                </div>
                                <div className="btn input-btn mt-2" onClick={() => handleUpdateMaxWalletPercentage(numberFromStringComma(maxWallet))}>Update</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 single-staking-item input-box">
                            <span className="item-title mb-2">Liquidity Tax(%)</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='0' value={sellTaxBuyback} onChange={e => setSellTaxBuyback(e.target.value)} />
                                </div>
                            </div>
                            <span className="item-title mb-2 mt-4">Marketing Tax(%)</span>
                            <div className="input-area d-flex flex-column">
                                <div className="input-text">
                                    <input type="text" placeholder='25' value={sellTaxMarketing} onChange={e => setSellTaxMarketing(e.target.value)} />
                                </div>
                                <div className="btn input-btn mt-2" onClick={() => handleUpdateSellTax(sellTaxBuyback, sellTaxMarketing)}>Update</div>
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
                                    lockerEnabledT1 === true ?
                                        <Link to={`/liquidity/${token}`} className="btn input-btn mt-2"><i className="fa-solid fa-lock mr-1" /> LP Management</Link>
                                        :
                                        <div className='btn input-btn mt-2' onClick={handleEnableLockerT1}>Enable Locker <i className="fa-solid fa-lock mr-1" /></div>
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

export default Template1