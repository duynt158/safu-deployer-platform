// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapRouterV2 {
    function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function factory() external view returns (address);
    function WETH() external view returns (address);
}

interface IUniswapFactoryV2 {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface IUniswapPairV2 {
    function token0() external view returns (address);
    function token1() external view returns (address);
}

interface IKissDeployer {
    function isKissToken(address token) external view returns (bool);
    function isKissTokenPair(address pair) external view returns (bool);
}

contract KissLPLocker is Ownable {
    uint256 constant public RESOLUTION = 10000;
    string constant public tokenDiscriminator = "Safu Smart Deployer Template ";

    struct LockInfo {
        address getter;
        uint256 amount;
        uint256 lockTime;
        uint256 expireTime;
    }

    struct LockInfoArrayWrapper {
        LockInfo[] info;
        uint256 now;
    }

    struct LockInfoWrapper {
        LockInfo info;
        uint256 now;
    }

    mapping(address => bool) public isFeeExempt;
    address[] public feeDistributionWallets;
    uint256[] public feeDistributionRates;
    uint256 public lockFee;
    address public uniswapV2Router;
    bool public tokenEnabled;

    mapping(address => mapping(address => LockInfo[])) context;
    address public kissDeployer;

    event SetFeeDistributionInfo(address[] wallets, uint256[] rates);
    event SetLockFee(uint256 fee);
    event SetExemptFee(address addr, bool exempt);
    event LockContext(address locker, address pair, address getter, uint256 amount, uint256 lockTime, uint256 expireTime);
    event UnlockContext(address locker, address pair, uint256 lockedIndex, address getter, uint256 amount, uint256 when);
    event AppendLockContext(address locker, address pair, uint256 lockedIndex, uint256 amount);
    event SplitContext(address locker, address pair, uint256 lockedIndex, uint256 amount);

    constructor(address[] memory _feeWallets, uint256[] memory _feeRates, uint256 _lockFee, address[] memory _feeExemptWallets, address _router, address _deployer) {
        require(_feeWallets.length == _feeRates.length, "Invalid Parameters: 0x1");

        uint256 i;

        feeDistributionWallets = new address[](_feeWallets.length);
        feeDistributionRates = new uint256[](_feeRates.length);
        for (i = 0; i < _feeWallets.length; i ++) {
            feeDistributionWallets[i] = _feeWallets[i];
            feeDistributionRates[i] = _feeRates[i];
        }
        emit SetFeeDistributionInfo(feeDistributionWallets, feeDistributionRates);

        lockFee = _lockFee;
        emit SetLockFee(lockFee);

        for (i = 0; i < _feeExemptWallets.length; i ++) {
            isFeeExempt[_feeExemptWallets[i]] = true;
            emit SetExemptFee(_feeExemptWallets[i], true);
        }

        uniswapV2Router = _router;
        kissDeployer = _deployer;
    }

    function distributePayment(uint256 feeAmount) internal {
        uint256 i;
        for (i = 0; i < feeDistributionWallets.length; i ++) {
            uint256 share = feeDistributionRates[i] * feeAmount / RESOLUTION;
            address feeRx = feeDistributionWallets[i];

            if (share > 0) {
                (bool success,) = payable(feeRx).call{value: share}("");
                if (!success) {
                    continue;
                }
            }
        }
    }

    function updateKissDeployer(address _deployer) external onlyOwner {
        require(kissDeployer != _deployer, "Already Set");
        kissDeployer = _deployer;
    }

    function setFeeDistributionInfo(address[] memory _feeWallets, uint256[] memory _feeRates) external onlyOwner {
        require(_feeWallets.length == _feeRates.length, "Invalid Parameters: 0x1");

        uint256 i;

        feeDistributionWallets = new address[](_feeWallets.length);
        feeDistributionRates = new uint256[](_feeRates.length);
        for (i = 0; i < _feeWallets.length; i ++) {
            feeDistributionWallets[i] = _feeWallets[i];
            feeDistributionRates[i] = _feeRates[i];
        }
        emit SetFeeDistributionInfo(feeDistributionWallets, feeDistributionRates);
    }

    function setLockFee(uint256 _lockFee) external onlyOwner {
        require(lockFee != _lockFee, "Already Set");
        lockFee = _lockFee;
        emit SetLockFee(_lockFee);
    }

    function setFeeExempt(address pair, bool set) external onlyOwner {
        require(isFeeExempt[pair] != set, "Already Set");
        isFeeExempt[pair] = set;
        emit SetExemptFee(pair, set);
    }

    function enableTokenLock(bool set) external onlyOwner {
        require(tokenEnabled != set, "Already Set");
        tokenEnabled = set;
    }

    function getLockTotalInfo(address user, address pair) external view returns (LockInfoArrayWrapper memory) {
        return LockInfoArrayWrapper({
            info: context[user][pair],
            now: block.timestamp
        });
    }

    function getLockInfo(address user, address pair, uint256 lockedIndex) external view returns (LockInfoWrapper memory) {
        return LockInfoWrapper({
            info: context[user][pair][lockedIndex],
            now: block.timestamp
        });
    }

    function _newLock(address locker, address pair, address getter, uint256 amount, uint256 period, bool emitEvent) internal returns (uint256){
        require (period >= 7 days, "Minimum Lock Period: 7 days");

        context[locker][pair].push(LockInfo({
            getter: getter,
            amount: amount,
            lockTime: block.timestamp,
            expireTime: block.timestamp + period
        }));

        if (emitEvent) {
            LockInfo storage li = context[locker][pair][context[locker][pair].length - 1];
            emit LockContext(locker, pair, getter, amount, li.lockTime, li.expireTime);
        }
        return context[locker][pair].length - 1;
    }

    function _disposeFee(address locker, address token, bool loose) private returns (uint256) {
        if (lockFee == 0) return 0;

        uint256 feeAmount = lockFee;

        if (isFeeExempt[locker] || (loose && isKissDeployerToken(token))) {
            feeAmount = 0;
        }

        require(msg.value >= feeAmount, "Please Charge Fee");

        if (feeAmount > 0) {
            distributePayment(feeAmount);
        }

        return feeAmount;
    }

    function _appendLock(address locker, address pair, uint256 lockedIndex, uint256 amount) internal {
        LockInfo storage li = context[locker][pair][lockedIndex];

        require(li.lockTime > 0 && li.expireTime > 0, "Not Valid Lock");
        li.amount += amount;

        emit AppendLockContext(locker, pair, lockedIndex, amount);
    }

    function _splitLock(address locker, address pair, uint256 lockedIndex, uint256 amount) internal {
        require(amount > 0, "Trivial");

        LockInfo storage li = context[locker][pair][lockedIndex];
        require(li.lockTime > 0 && li.expireTime > 0, "Not Valid Lock");
        require(li.amount >= amount, "Not Enough Lock");

        li.amount -= amount;

        uint256 lastIndex = _newLock(locker, pair, li.getter, amount, li.expireTime - li.lockTime, false);

        LockInfo storage liLast = context[locker][pair][lastIndex];
        liLast.lockTime = li.lockTime;
        liLast.expireTime = li.expireTime;

        emit SplitContext(locker, pair, lockedIndex, amount);
    }

    function _addToLPFromLocker(address locker, address token, uint256 tokenAmount, uint256 ethAmount) private returns (uint256 liquidity) {
        uint256 oldBalance = IERC20(token).balanceOf(address(this));
        IERC20(token).transferFrom(locker, address(this), tokenAmount);
        uint256 newBalance = IERC20(token).balanceOf(address(this));

        uint256 realAmount = newBalance - oldBalance;

        IERC20(token).approve(uniswapV2Router, realAmount);

        uint256 amountToken;
        uint256 amountETH;
        (amountToken, amountETH, liquidity) = IUniswapRouterV2(uniswapV2Router).addLiquidityETH{value: ethAmount}(token, realAmount, 0, 0, address(this), block.timestamp);

        if (realAmount > amountToken) {
            IERC20(token).transfer(locker, realAmount - amountToken);
        }

        if (ethAmount > amountETH) {
            (bool success, ) = payable(address(locker)).call{value: ethAmount - amountETH}("");
            require(success, "Failed to fund back");
        }
    }

    function addToLPAndLock(address token, address getter, uint256 amount, uint256 lockPeriod) external payable {
        address locker = msg.sender;

        uint256 feeAmount = _disposeFee(locker, token, true);

        uint256 liquidity = _addToLPFromLocker(locker, token, amount, msg.value - feeAmount);

        address factory = IUniswapRouterV2(uniswapV2Router).factory();
        address pair = IUniswapFactoryV2(factory).getPair(token, IUniswapRouterV2(uniswapV2Router).WETH());

        _newLock(locker, pair, getter, liquidity, lockPeriod, true);
    }

    function addToLPAndAppendLock(address token, uint256 amount, uint256 lockedIndex) external payable {
        address locker = msg.sender;

        uint256 liquidity = _addToLPFromLocker(locker, token, amount, msg.value);

        address factory = IUniswapRouterV2(uniswapV2Router).factory();
        address pair = IUniswapFactoryV2(factory).getPair(token, IUniswapRouterV2(uniswapV2Router).WETH());

        _appendLock(locker, pair, lockedIndex, liquidity);
    }

    function lock(address pair, address getter, uint256 liquidity, uint256 lockPeriod) external payable {
        address locker = msg.sender;

        require(tokenEnabled || isKissTokenPair(pair) != 2, "Not LP Token");

        uint256 feeAmount = _disposeFee(locker, pair, false);
        if (msg.value > feeAmount) {
            (bool success, ) = payable(locker).call{value: msg.value - feeAmount}("");
            require(success, "Failed to refund");
        }

        IERC20(pair).transferFrom(locker, address(this), liquidity);
        _newLock(locker, pair, getter, liquidity, lockPeriod, true);
    }

    function appendLock(address pair, uint256 lockedIndex, uint256 amount) external {
        address locker = msg.sender;
        IERC20(pair).transferFrom(locker, address(this), amount);
        _appendLock(locker, pair, lockedIndex, amount);
    }

    function splitLock(address pair, uint256 lockedIndex, uint256 amount) external {
        address locker = msg.sender;
        _splitLock(locker, pair, lockedIndex, amount);
    }

    function unlock(address pair, uint256 lockedIndex, uint256 amount) external {
        address locker = msg.sender;
        LockInfo storage li = context[locker][pair][lockedIndex];
        require(li.amount > 0, "Not Locked");
        require(li.lockTime > 0 && li.expireTime > 0 && li.expireTime < block.timestamp, "Not Expired");
        require(li.amount >= amount, "Asked Too Much");

        IERC20(pair).transfer(li.getter, amount);
        li.amount -= amount;

        if (li.amount == 0) {
            delete context[locker][pair][lockedIndex];
        }
        emit UnlockContext(locker, pair, lockedIndex, li.getter, amount, block.timestamp);
    }

    function isKissDeployerToken(address token) public view returns (bool) {
        try IKissDeployer(kissDeployer).isKissToken(token) returns (bool ret) {
            return ret;
        } catch {
            return false;
        }
    }

    function isKissTokenPair(address pair) public view returns(uint256) {
        try IKissDeployer(kissDeployer).isKissTokenPair(pair) returns (bool ret) {
            if (ret) return 0;
            else return 1;
        } catch {
            IUniswapFactoryV2 factory = IUniswapFactoryV2(IUniswapRouterV2(uniswapV2Router).factory());
            address token0;
            address token1;
            try IUniswapPairV2(pair).token0() returns (address ret) {
                token0 = ret;
            } catch {
                token0 = address(0);
            }

            try IUniswapPairV2(pair).token1() returns (address ret) {
                token1 = ret;
            } catch {
                token1 = address(0);
            }

            if (factory.getPair(token0, token1) == pair) return 1;
            else return 2;
        }
    }

    receive() external payable {
    }
}
