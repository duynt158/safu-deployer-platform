import { useState, useEffect, useCallback } from 'react'
import useLockContext from '../../hooks/useLockContext'
import walletConfig from '../../contexts/WalletContext/config'
import { useGlobal } from '../../contexts/GlobalContext'

const LockHistory = ({token}) => {
    const { chainId } = useGlobal()

    const [data] = useState({
        heading_1: "#ID",
        heading_2: "Getter",
        heading_3: "Locked",
        heading_4: "Until",
        heading_5: "Balance"
    })
    const [page, setPage] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const ItemsPerPage = 10

    const { handleUnlock, lockedRecords } = useLockContext(token)

    useEffect(() => {
        let count = lockedRecords.length
        setPageCount(Math.floor((count + ItemsPerPage - 1) / ItemsPerPage))
    }, [lockedRecords])

    useEffect(() => {
        if (page >= pageCount) {
            if (pageCount > 0) {
                setPage(pageCount - 1)
            } else {
                setPage(0)
            }
        }
    }, [pageCount, page])

    const handleFirstPage = useCallback(() => {
        setPage(0)
    }, [])

    const handleLastPage = useCallback(() => {
        if (pageCount > 0) setPage(pageCount - 1)
        else setPage(0)
    }, [pageCount])

    const handleNextPage = useCallback(() => {
        if (page < pageCount - 1) setPage(p => p + 1)
    }, [page, pageCount])

    const handlePrevPage = useCallback(() => {
        if (page > 0) setPage(p => p - 1)
        if (page >= pageCount) {
            if (pageCount > 0) setPage(pageCount - 1)
            else setPage(0)
        }
    }, [page, pageCount])

    const buildPageNav = useCallback(() => {
        let leftArrow = false
        let firstPage = 0
        let lastPage = pageCount - 1
        let leftDot = false
        let rightDot = false
        let rightArrow = false
        let showLastPage = true

        if (firstPage >= lastPage) showLastPage = false

        if (pageCount > 4) {
            if (page > firstPage) leftArrow = true
            if (page > firstPage + 1) leftDot = true
            if (page < lastPage) rightArrow = true
            if (page < lastPage - 1) rightDot = true
        }

        return (
            <>
                {
                    leftArrow === true && <li><a className="prev page-numbers" onClick={handlePrevPage}><i className="icon-arrow-left" /></a></li>
                }
                {
                    page === firstPage ?
                        <li><span aria-current="page" className="page-numbers current">{firstPage + 1}</span></li>
                        :
                        <li><a className="page-numbers" href="#" onClick={handleFirstPage}>{firstPage + 1}</a></li>
                }
                {
                    leftDot === true && <li><span className="page-numbers dots">…</span></li>
                }
                {
                    page !== firstPage && page !== lastPage &&
                    <li><span aria-current="page" className="page-numbers current">{page + 1}</span></li>
                }
                {
                    rightDot === true && <li><span className="page-numbers dots">…</span></li>
                }
                {
                    showLastPage === true &&
                    (
                        page === lastPage ?
                            <li><span aria-current="page" className="page-numbers current">{lastPage + 1}</span></li>
                            :
                            <li><a className="page-numbers" href="#" onClick={handleLastPage}>{lastPage + 1}</a></li>
                    )
                }
                {
                    rightArrow === true && <li><a className="next page-numbers" href="#" onClick={handleNextPage}><i className="icon-arrow-right" /></a></li>
                }
            </>
        )
    }, [page, pageCount, handleFirstPage, handleNextPage, handlePrevPage, handleLastPage])

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <nav>
                        <ul className="page-numbers">
                            {buildPageNav()}
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="table-responsive">
                        <table className="table token-content table-borderless">
                            <thead>
                                <tr>
                                    <th scope="col">{data.heading_1}</th>
                                    <th scope="col">{data.heading_2}</th>
                                    <th scope="col">{data.heading_3}</th>
                                    <th scope="col">{data.heading_4}</th>
                                    <th scope="col">{data.heading_5}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lockedRecords.map((item, idx) => {
                                    if (idx < page * ItemsPerPage || idx >= (page + 1) * ItemsPerPage) {
                                        return (<></>)
                                    } else {
                                        return (
                                            <tr key={`lbd_${idx}`}>
                                                <td>{item.id}</td>
                                                <td><a href={`${walletConfig[chainId].blockUrls[0]}address/${item.getter}`} target='_blank' rel='noreferrer'>{item.getter}</a></td>
                                                <td>{parseFloat((item.c.duration / 86400).toFixed(2))} days</td>
                                                <td>
                                                    {
                                                        item.c.until.length === 0 ?
                                                            <span className='btn' style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '500' }} onClick={() => handleUnlock(item.id - 1, item.c.amount)}>Unlock</span>
                                                            :
                                                            item.c.until
                                                    }
                                                </td>
                                                <td>{item.c.amount.toString()}</td>
                                            </tr>
                                        )
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12">
                    <nav>
                        <ul className="page-numbers">
                            {buildPageNav()}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default LockHistory