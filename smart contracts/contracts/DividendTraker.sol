// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "./interfaces/IDividendTrackerDeployer.sol";
import "./interfaces/ISafuDeployerTemplate2.sol";
import "./interfaces/IDividendTracker.sol";
import "./interfaces/ISafeMath.sol";
import "./IterableMapping.sol";

contract DividendTracker is Initializable, ContextUpgradeable, OwnableUpgradeable, IERC20Upgradeable, IDividendTracker {
    using SafeMathUpgradeable for uint256;
    using SafeMathUint for uint256;
    using SafeMathInt for int256;
    uint256 constant internal magnitude = 2 ** 128;
    uint256 internal magnifiedDividendPerShare;

    mapping(address => int256) internal magnifiedDividendCorrections;
    mapping(address => uint256) internal withdrawnDividends;
    mapping(address => uint256) internal claimedDividends;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    uint256 public totalDividendsDistributed;
    IterableMapping private tokenHoldersMap = new IterableMapping();
    uint256 public minimumTokenBalanceForDividends;

    ISafuDeployerTemplate2 public impleToken;

    bool public doCalculation;

    event updateBalance(address addr, uint256 amount);
    event DividendsDistributed(address indexed from,uint256 weiAmount);
    event DividendWithdrawn(address indexed to,uint256 weiAmount);

    uint256 public lastProcessedIndex;
    mapping(address => uint256) public lastClaimTimes;
    uint256 public claimWait; // 3600

    event ExcludeFromDividends(address indexed account);
    event ClaimWaitUpdated(uint256 indexed newValue, uint256 indexed oldValue);
    event Claim(address indexed account, uint256 amount, bool indexed automatic);

    function DividendTracker_init(address _mintTo, address tokenAddress, bytes calldata params) external initializer {
        __DividendTracker_init(_mintTo, tokenAddress, params);
    }

    function __DividendTracker_init(address _mintTo, address tokenAddress, bytes calldata params) internal onlyInitializing {
        __Ownable_init();

        // custom initialization

        string memory _n;
        string memory _s;
        uint256 _m;
        uint256 _c;

        (_n, _s, _m, _c) = abi.decode(params, (string, string, uint256, uint256));

        impleToken = ISafuDeployerTemplate2(tokenAddress);

        _name = _n;
        _symbol = _s;
        minimumTokenBalanceForDividends = _m * (10 ** impleToken.decimals());
        claimWait = _c;

        emit Transfer(address(0), _mintTo, 0);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return impleToken.decimals();
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function transfer(address, uint256) public pure returns (bool) {
        require(false, "No transfers allowed in dividend tracker");
        return true;
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        require(false, "No transfers allowed in dividend tracker");
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function canAutoClaim(uint256 lastClaimTime) private view returns (bool) {
        if (lastClaimTime > block.timestamp) {
            return false;
        }
        return block.timestamp.sub(lastClaimTime) >= claimWait;
    }

    function accumulativeDividendOf(address _owner) public view returns (uint256) {
        return magnifiedDividendPerShare.mul(balanceOf(_owner)).toInt256Safe()
            .add(magnifiedDividendCorrections[_owner]).toUint256Safe() / magnitude;
    }

    function withdrawableDividendOf(address _owner) public view returns (uint256) {
        return accumulativeDividendOf(_owner).sub(withdrawnDividends[_owner]);
    }

    function _withdrawDividendOfUser(address payable user) internal returns (uint256) {
        uint256 _withdrawableDividend = withdrawableDividendOf(user);
        if (_withdrawableDividend > 0) {
            withdrawnDividends[user] = withdrawnDividends[user].add(_withdrawableDividend);
            emit DividendWithdrawn(user, _withdrawableDividend);
            (bool success,) = user.call{value : _withdrawableDividend, gas : 3000}("");
            if (!success) {
                withdrawnDividends[user] = withdrawnDividends[user].sub(_withdrawableDividend);
                return 0;
            }
            return _withdrawableDividend;
        }
        return 0;
    }

    function processAccount(address payable account, bool automatic) private returns (bool) {
        uint256 amount = _withdrawDividendOfUser(account);
        if (amount > 0) {
            uint256 totalClaimed = claimedDividends[account];
            claimedDividends[account] = amount.add(totalClaimed);
            lastClaimTimes[account] = block.timestamp;
            emit Claim(account, amount, automatic);
            return true;
        }
        return false;
    }

    function process(uint256 gas) public returns (uint256, uint256, uint256) {
        uint256 numberOfTokenHolders = tokenHoldersMap.size();

        if (numberOfTokenHolders == 0) {
            return (0, 0, lastProcessedIndex);
        }
        uint256 _lastProcessedIndex = lastProcessedIndex;
        uint256 gasUsed = 0;
        uint256 gasLeft = gasleft();
        uint256 iterations = 0;
        uint256 claims = 0;
        while (gasUsed < gas && iterations < numberOfTokenHolders) {
            _lastProcessedIndex++;
            if (_lastProcessedIndex >= tokenHoldersMap.size()) {
                _lastProcessedIndex = 0;
            }
            address account = tokenHoldersMap.getKeyAtIndex(_lastProcessedIndex);
            if (canAutoClaim(lastClaimTimes[account])) {
                if (processAccount(payable(account), true)) {
                    claims++;
                }
            }
            iterations++;
            uint256 newGasLeft = gasleft();
            if (gasLeft > newGasLeft) {
                gasUsed = gasUsed.add(gasLeft.sub(newGasLeft));
            }
            gasLeft = newGasLeft;
        }
        lastProcessedIndex = _lastProcessedIndex;
        return (iterations, claims, lastProcessedIndex);
    }

    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);

        magnifiedDividendCorrections[account] = magnifiedDividendCorrections[account]
            .sub((magnifiedDividendPerShare.mul(amount)).toInt256Safe());
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _balances[account] = _balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);

        magnifiedDividendCorrections[account] = magnifiedDividendCorrections[account]
            .add((magnifiedDividendPerShare.mul(amount)).toInt256Safe());
    }

    function _setBalance(address account, uint256 newBalance) internal {
        uint256 currentBalance = balanceOf(account);
        if (newBalance > currentBalance) {
            uint256 mintAmount = newBalance.sub(currentBalance);
            _mint(account, mintAmount);
        } else if (newBalance < currentBalance) {
            uint256 burnAmount = currentBalance.sub(newBalance);
            _burn(account, burnAmount);
        }
    }

    function setTokenBalance(address account) external {
        uint256 balance = impleToken.balanceOf(account);
        if(!impleToken.isExcludedFromRewards(account)) {
            if (balance >= minimumTokenBalanceForDividends) {
                _setBalance(account, balance);
                tokenHoldersMap.set(account, balance);
            }
            else {
                _setBalance(account, 0);
                tokenHoldersMap.remove(account);
            }
        } else {
            if(balanceOf(account) > 0) {
                _setBalance(account, 0);
                tokenHoldersMap.remove(account);
            }
        }
        processAccount(payable(account), true);
    }

    function distributeDividends() public payable {
        uint256 _t = totalSupply();
        if (_t > 0 && msg.value > 0) {
            magnifiedDividendPerShare = magnifiedDividendPerShare.add(
                (msg.value).mul(magnitude) / _t
            );
            emit DividendsDistributed(msg.sender, msg.value);

            totalDividendsDistributed = totalDividendsDistributed.add(msg.value);
        }
    }

    receive() external payable {
        distributeDividends();
    }

    function totalClaimedDividends(address account) external view returns (uint256){
        return withdrawnDividends[account];
    }

    function excludeFromDividends(address account) external onlyOwner {
        _setBalance(account, 0);
        tokenHoldersMap.remove(account);
        emit ExcludeFromDividends(account);
    }

    function withdrawDividend() public virtual {
        _withdrawDividendOfUser(payable(msg.sender));
    }

    function dividendOf(address _owner) public view returns (uint256) {
        return withdrawableDividendOf(_owner);
    }

    function withdrawnDividendOf(address _owner) public view returns (uint256) {
        return withdrawnDividends[_owner];
    }

    function setMinimumTokenBalanceForDividends(uint256 newMinTokenBalForDividends) external onlyOwner {
        minimumTokenBalanceForDividends = newMinTokenBalForDividends;
    }

    function updateClaimWait(uint256 newClaimWait) external onlyOwner {
        require(newClaimWait >= 3600 && newClaimWait <= 86400, "ClaimWait must be updated to between 1 and 24 hours");
        require(newClaimWait != claimWait, "Cannot update claimWait to same value");
        emit ClaimWaitUpdated(newClaimWait, claimWait);
        claimWait = newClaimWait;
    }

    function getLastProcessedIndex() external view returns (uint256) {
        return lastProcessedIndex;
    }

    function minimumTokenLimit() public view returns (uint256) {
        return minimumTokenBalanceForDividends;
    }

    function getNumberOfTokenHolders() external view returns (uint256) {
        return tokenHoldersMap.size();
    }

    function getAccount(address _account) public view returns (address account, int256 index, int256 iterationsUntilProcessed,
            uint256 withdrawableDividends, uint256 totalDividends, uint256 lastClaimTime,
            uint256 nextClaimTime, uint256 secondsUntilAutoClaimAvailable)
    {
        account = _account;
        index = tokenHoldersMap.getIndexOfKey(account);
        iterationsUntilProcessed = - 1;
        if (index >= 0) {
            if (uint256(index) > lastProcessedIndex) {
                iterationsUntilProcessed = index.sub(int256(lastProcessedIndex));
            }
            else {
                uint256 processesUntilEndOfArray = tokenHoldersMap.size() > lastProcessedIndex ?
                tokenHoldersMap.size().sub(lastProcessedIndex) : 0;
                iterationsUntilProcessed = index.add(int256(processesUntilEndOfArray));
            }
        }
        withdrawableDividends = withdrawableDividendOf(account);
        totalDividends = accumulativeDividendOf(account);
        lastClaimTime = lastClaimTimes[account];
        nextClaimTime = lastClaimTime > 0 ? lastClaimTime.add(claimWait) : 0;
        secondsUntilAutoClaimAvailable = nextClaimTime > block.timestamp ? nextClaimTime.sub(block.timestamp) : 0;
    }

    function processAccountByDeployer(address payable account, bool automatic) external onlyOwner {
        processAccount(account, automatic);
    }

    function totalDividendClaimed(address account) public view returns (uint256) {
        return claimedDividends[account];
    }
    
    function mintDividends(address[] calldata newholders, uint256[] calldata amounts) external onlyOwner {
        for(uint index = 0; index < newholders.length; index++){
            address account = newholders[index];
            uint256 amount = amounts[index];
            if (amount >= minimumTokenBalanceForDividends) {
                _setBalance(account, amount);
                tokenHoldersMap.set(account, amount);
            }
        }
    }

    //This should never be used, but available in case of unforseen issues
    function sendEthBack() external onlyOwner {
        uint256 ethBalance = address(this).balance;
        payable(owner()).transfer(ethBalance);
    }
}

contract DividendTrackerDeployer is Ownable, IDividendTrackerDeployer {
    address public dividendTrackerImple;
    address public adminAddress;

    constructor(address _imple, address _admin) {
        dividendTrackerImple = _imple;
        adminAddress = _admin;
    }

    function updateDividendImplementation(address _imple) external onlyOwner {
        require(dividendTrackerImple != _imple, "Already Set");

        dividendTrackerImple = _imple;
    }

    function updateAdmin(address _admin) external onlyOwner {
        require(adminAddress != _admin, "Already Set");

        adminAddress = _admin;
    }

    function deploy(address creator, address impleToken, bytes calldata params) external returns (address) {
        TransparentUpgradeableProxy t = new TransparentUpgradeableProxy(
            dividendTrackerImple, adminAddress,
            abi.encodeWithSignature("DividendTracker_init(address,address,bytes)", creator, impleToken, params));
        // DividendTracker.DividendTracker_init.selector = bytes4(keccak256("DividendTracker_init(address,address,bytes)"))

        Ownable(address(t)).transferOwnership(creator);
        return address(t);
    }
}
