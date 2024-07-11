// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./pancake/PancakeRouter.sol";
import "./pancake/interfaces/IPancakeFactory.sol";
import "./interfaces/IDividendTrackerDeployer.sol";
import "./interfaces/ISafuDeployerTemplate2.sol";
import "./interfaces/IDividendTracker.sol";
import "./interfaces/ISafuDeployer.sol";
import "./interfaces/ISafuDeployerBaseTemplate.sol";

uint256 constant RESOLUTION = 10000;

contract SafuDeployerTemplate2 is Context, Ownable, ISafuDeployerBaseTemplate, ISafuDeployerTemplate2 {
    using SafeMath for uint256;
    using Address for address;

    event SwapAndLiquifyEnabledUpdated(bool enabled);
    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiqudity
    );

    modifier lockTheSwap {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }

    string constant public identifier = "Safu Smart Deployer Template 2";
    
    IPancakeRouter02 public uniswapV2Router;
    address public uniswapV2Pair;

    mapping(address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;
    mapping (address => bool) private botWallets;
    mapping (address => bool) private _isExcludedFromFee;
    mapping (address => bool) private isExchangeWallet;
    mapping (address => bool) private _isExcludedFromRewards;
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 private _tTotal;
    bool inSwapAndLiquify;
    bool public swapAndLiquifyEnabled; // true
    bool public isTaxFreeTransfer; // true
    uint256 public maxBuyAmount;
    uint256 public maxWalletAmount;
    uint256 public ethPriceToSwap; // 300000000000000000 = .3 ETH
    uint public ethSellAmount; // 1000000000000000000 = 1 ETH
    address public buyBackAddress;
    address public marketingAddress;
    address public devAddress;
    address public deadWallet;
    uint256 public gasForProcessing;
    event ProcessedDividendTracker(uint256 iterations, uint256 claims, uint256 lastProcessedIndex, bool indexed automatic,uint256 gas, address indexed processor);
    event SendDividends(uint256 EthAmount);
    
    struct Distribution {
        uint256 devTeam;
        uint256 marketing;
        uint256 dividend;
        uint256 buyBack;
    }

    struct TaxFees {
        uint256 buyFee;
        uint256 sellFee;
        uint256 largeSellFee;
    }

    bool private doTakeFees;
    bool private isSellTxn;
    TaxFees public taxFees;
    Distribution public distribution;
    IDividendTracker public dividendTracker;

    constructor (address _mintTo, bytes memory _params) {
        bytes memory decoded;

        {
            uint256 _supply;
            (_name, _symbol, _decimals, _supply, decoded)
                = abi.decode(_params, (string, string, uint8, uint256, bytes));

            _tTotal = _supply * (10 ** _decimals);
            _balances[_mintTo] = _tTotal;
        }

        {
            address _routerAddress; // uniswap v2 router, 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
            uint256 _maxBuyPercentage; // 200 = 2%
            (_routerAddress, swapAndLiquifyEnabled, isTaxFreeTransfer, _maxBuyPercentage, decoded)
                = abi.decode(decoded, (address, bool, bool, uint256, bytes));

            uniswapV2Router = IPancakeRouter02(_routerAddress);
            uniswapV2Pair = IPancakeFactory(uniswapV2Router.factory()).createPair(address(this), uniswapV2Router.WETH());
            _isExcludedFromRewards[uniswapV2Pair] = true;

            require(_maxBuyPercentage <= 500, "Max Tx <= 5%");
            maxBuyAmount = _tTotal * _maxBuyPercentage / RESOLUTION;
        }

        {
            uint256 _maxWalletPercentage; // 200 = 2%
            (_maxWalletPercentage, ethPriceToSwap, ethSellAmount, buyBackAddress, decoded)
                = abi.decode(decoded, (uint256, uint256, uint256, address, bytes));

            require(_maxWalletPercentage <= 500, "Max Wallet <= 5%");
            maxWalletAmount = _tTotal * _maxWalletPercentage / RESOLUTION;
        }

        {
            (marketingAddress, devAddress, gasForProcessing, decoded)
                = abi.decode(decoded, (address, address, uint256, bytes));
        }

        {
            uint256 _buyFee; // 1000 = 10%
            uint256 _sellFee; // 2000 = 20%
            uint256 _largeSellFee; // 2000 = 20%

            (_buyFee, _sellFee, _largeSellFee, decoded)
                = abi.decode(decoded, (uint256, uint256, uint256, bytes));

            require(_buyFee + _sellFee <= RESOLUTION && _buyFee + _largeSellFee <= RESOLUTION, "Invalid Parameters");
            require(_buyFee <= 2000, "Buy Fee Exceeds 20%");
            require(_sellFee <= 2000, "Sell Fee Exceeds 20%");
            require(_largeSellFee <= 5000, "Large Sell Fee Exceeds 50%");

            taxFees = TaxFees(_buyFee, _sellFee, _largeSellFee);
        }
        {
            uint256 _devTeam; // 0 = 0%
            uint256 _marketing; // 4000 = 40%
            uint256 _dividend; // 6000 = 60%
            uint256 _buyBack; // 0 = 0%

            (_devTeam, _marketing, _dividend, _buyBack)
                = abi.decode(decoded, (uint256, uint256, uint256, uint256));

            require(_devTeam + _marketing + _dividend + _buyBack <= RESOLUTION, "Invalid Parameters");

            distribution = Distribution(_devTeam, _marketing, _dividend, _buyBack);
        }

        deadWallet = 0x000000000000000000000000000000000000dEaD;

        _isExcludedFromFee[_mintTo] = true;
        _isExcludedFromFee[buyBackAddress] = true;
        _isExcludedFromFee[marketingAddress] = true;
        _isExcludedFromFee[devAddress] = true;
        _isExcludedFromFee[address(this)] = true;

        _isExcludedFromRewards[_mintTo] = true;
        _isExcludedFromRewards[buyBackAddress] = true;
        _isExcludedFromRewards[marketingAddress] = true;
        _isExcludedFromRewards[devAddress] = true;
        _isExcludedFromRewards[deadWallet] = true;
        _isExcludedFromRewards[address(this)] = true;
        
        emit Transfer(address(0), _mintTo, _tTotal);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _tTotal;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
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

    function airDrops(address[] calldata newholders, uint256[] calldata amounts) external {
        uint256 iterator = 0;
        require(_isExcludedFromFee[_msgSender()], "Airdrop can only be done by one excluded from fee");
        require(newholders.length == amounts.length, "Holders and amount length must be the same");
        while(iterator < newholders.length){
            _tokenTransfer(_msgSender(), newholders[iterator], amounts[iterator], false, false, false);
            iterator += 1;
        }
    }

    function setMaxWalletAmount(uint256 _maxWalletPercentage) external onlyOwner() {
        require(_maxWalletPercentage <= 500, "Max Wallet <= 5%");
        maxWalletAmount = _tTotal * _maxWalletPercentage / RESOLUTION;
    }

    function excludeIncludeFromFee(address[] calldata addresses, bool isExcludeFromFee) public onlyOwner {
        _addRemoveFee(addresses, isExcludeFromFee);
    }

    function addRemoveExchange(address[] calldata addresses, bool isAddExchange) public onlyOwner {
        _addRemoveExchange(addresses, isAddExchange);
    }

    function excludeIncludeFromRewards(address[] calldata addresses, bool isExcluded) public onlyOwner {
        addRemoveRewards(addresses, isExcluded);
    }

    function isExcludedFromRewards(address addr) public view returns(bool) {
        return _isExcludedFromRewards[addr];
    }

    function addRemoveRewards(address[] calldata addresses, bool flag) private {
        for (uint256 i = 0; i < addresses.length; i++) {
            address addr = addresses[i];
            _isExcludedFromRewards[addr] = flag;
        }
    }

    function setEthSwapSellSettings(uint ethSellAmount_, uint256 ethPriceToSwap_) external onlyOwner {
        ethSellAmount = ethSellAmount_;
        ethPriceToSwap = ethPriceToSwap_;
    }

    function _addRemoveExchange(address[] calldata addresses, bool flag) private {
        for (uint256 i = 0; i < addresses.length; i++) {
            address addr = addresses[i];
            isExchangeWallet[addr] = flag;
        }
    }

    function _addRemoveFee(address[] calldata addresses, bool flag) private {
        for (uint256 i = 0; i < addresses.length; i++) {
            address addr = addresses[i];
            _isExcludedFromFee[addr] = flag;
        }
    }

    function setMaxBuyAmount(uint256 _maxBuyPercentage) external onlyOwner() {
        require(_maxBuyPercentage <= 500, "Max Tx <= 5%");
        maxBuyAmount = _tTotal * _maxBuyPercentage / RESOLUTION;
    }

    function setTaxFees(uint256 buyFee, uint256 sellFee, uint256 largeSellFee) external onlyOwner {
        require(buyFee + sellFee <= RESOLUTION && buyFee + largeSellFee <= RESOLUTION, "Invalid Parameters");
        require(buyFee <= 2000, "Buy Fee Exceeds 20%");
        require(sellFee <= 2000, "Sell Fee Exceeds 20%");
        require(largeSellFee <= 5000, "Large Sell Fee Exceeds 50%");

        taxFees.buyFee = buyFee;
        taxFees.sellFee = sellFee;
        taxFees.largeSellFee = largeSellFee;
    }

    function setDistribution(uint256 dividend, uint256 devTeam, uint256 marketing, uint256 buyBack) external onlyOwner {
        require(dividend + devTeam + marketing + buyBack <= RESOLUTION, "Invalid Parameters");
        distribution.dividend = dividend;
        distribution.devTeam = devTeam;
        distribution.marketing = marketing;
        distribution.buyBack = buyBack;
    }

    function setWalletAddresses(address devAddr, address buyBack, address marketingAddr) external onlyOwner {
        devAddress = devAddr;
        buyBackAddress = buyBack;
        marketingAddress = marketingAddr;

        _isExcludedFromFee[buyBackAddress] = true;
        _isExcludedFromFee[marketingAddress] = true;
        _isExcludedFromFee[devAddress] = true;
    }

    function udpateDividendTracker(address newAddress) external onlyOwner {
        require(address(dividendTracker) != newAddress, "Already Set");
        dividendTracker = IDividendTracker(newAddress);
    }

    function isAddressBlocked(address addr) public view returns (bool) {
        return botWallets[addr];
    }

    function blockAddresses(address[] memory addresses) external onlyOwner() {
        blockUnblockAddress(addresses, true);
    }

    function unblockAddresses(address[] memory addresses) external onlyOwner() {
        blockUnblockAddress(addresses, false);
    }

    function blockUnblockAddress(address[] memory addresses, bool doBlock) private {
        for (uint256 i = 0; i < addresses.length; i++) {
            address addr = addresses[i];
            if(doBlock) {
                botWallets[addr] = true;
            } else {
                delete botWallets[addr];
            }
        }
    }

    function setSwapAndLiquifyEnabled(bool _enabled) public onlyOwner {
        require(swapAndLiquifyEnabled != _enabled, "Already Set");
        swapAndLiquifyEnabled = _enabled;
        emit SwapAndLiquifyEnabledUpdated(_enabled);
    }

    receive() external payable {}

    function getPriceInETH(uint tokenAmount) public view returns (uint)  {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();
        return uniswapV2Router.getAmountsOut(tokenAmount, path)[1];
    }

    function isExcludedFromFee(address account) public view returns(bool) {
        return _isExcludedFromFee[account];
    }

    function enableDisableTaxFreeTransfers(bool enableDisable) external onlyOwner {
        require(isTaxFreeTransfer != enableDisable, "Already Set");
        isTaxFreeTransfer = enableDisable;
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _transfer(address from, address to, uint256 amount) private {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        require(uniswapV2Pair != address(0),"UniswapV2Pair has not been set");
        bool isSell = false;
        bool takeFees = !_isExcludedFromFee[from] && !_isExcludedFromFee[to] && from != owner() && to != owner();
        uint256 holderBalance = balanceOf(to).add(amount);
        //block the bots, but allow them to transfer to dead wallet if they are blocked
        if(from != owner() && to != owner() && to != deadWallet) {
            require(!botWallets[from] && !botWallets[to], "bots are not allowed to sell or transfer tokens");
        }

        if(takeFees && (from == uniswapV2Pair || isExchangeWallet[from])) {
            require(amount <= maxBuyAmount, "Transfer amount exceeds the maxTxAmount.");
            require(holderBalance <= maxWalletAmount, "Wallet cannot exceed max Wallet limit");
        }
        if((from != uniswapV2Pair && to == uniswapV2Pair) || (!isExchangeWallet[from] && isExchangeWallet[to])) { //if sell
            //only tax if tokens are going back to Uniswap
            isSell = true;
            sellTaxTokens();
        }

        if(from != uniswapV2Pair && to != uniswapV2Pair && !isExchangeWallet[from] && !isExchangeWallet[to]) {
            takeFees = isTaxFreeTransfer ? false : true;
        }
        _tokenTransfer(from, to, amount, takeFees, isSell, true);
    }

    function sellTaxTokens() private {
        uint256 contractTokenBalance = balanceOf(address(this));
        if(contractTokenBalance > 0) {
            uint ethPrice = getPriceInETH(contractTokenBalance);
            if (ethPrice >= ethPriceToSwap && !inSwapAndLiquify && swapAndLiquifyEnabled) {
                //send eth to wallets marketing and dev
                distributeShares(contractTokenBalance);
            }
        }
    }

    function updateGasForProcessing(uint256 newValue) public onlyOwner {
        require(newValue != gasForProcessing, "Already Set");
        gasForProcessing = newValue;
    }

    function distributeShares(uint256 balanceToShareTokens) private {
        swapTokensForEth(balanceToShareTokens);
        uint256 distributionEth = address(this).balance;
        uint256 marketingShare = distributionEth.mul(distribution.marketing).div(RESOLUTION);
        uint256 dividendShare = distributionEth.mul(distribution.dividend).div(RESOLUTION);
        uint256 devTeamShare = distributionEth.mul(distribution.devTeam).div(RESOLUTION);
        uint256 buyBackShare = distributionEth.mul(distribution.buyBack).div(RESOLUTION);
        payable(marketingAddress).transfer(marketingShare);
        sendEthDividends(dividendShare);
        payable(devAddress).transfer(devTeamShare);
        payable(buyBackAddress).transfer(buyBackShare);
    }

    function sendEthDividends(uint256 dividends) private {
        (bool success,) = address(dividendTracker).call{value : dividends}("");
        if (success) {
            emit SendDividends(dividends);
        }
    }
    
    function swapTokensForEth(uint256 tokenAmount) private lockTheSwap {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();
        _approve(address(this), address(uniswapV2Router), tokenAmount);
        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
    }

    //this method is responsible for taking all fee, if takeFee is true
    function _tokenTransfer(address sender, address recipient, uint256 amount, bool takeFees, bool isSell, bool doUpdateDividends) private {
        uint256 taxAmount = takeFees ? amount.mul(taxFees.buyFee).div(RESOLUTION) : 0;
        if(takeFees && isSell) {
            taxAmount = amount.mul(taxFees.sellFee).div(RESOLUTION);
            if(taxFees.largeSellFee > 0) {
                uint ethPrice = getPriceInETH(amount);
                if(ethPrice >= ethSellAmount) {
                    taxAmount = amount.mul(taxFees.largeSellFee).div(RESOLUTION);
                }
            }
        }
        uint256 transferAmount = amount.sub(taxAmount);
        _balances[sender] = _balances[sender].sub(amount);
        _balances[recipient] = _balances[recipient].add(transferAmount);
        _balances[address(this)] = _balances[address(this)].add(taxAmount);
        emit Transfer(sender, recipient, amount);

        if(doUpdateDividends) {
            try dividendTracker.setTokenBalance(sender) {} catch{}
            try dividendTracker.setTokenBalance(recipient) {} catch{}
            try dividendTracker.process(gasForProcessing) returns (uint256 iterations, uint256 claims, uint256 lastProcessedIndex) {
                emit ProcessedDividendTracker(iterations, claims, lastProcessedIndex, true, gasForProcessing, tx.origin);
            } catch {}
        }
    }
}

contract SafuDeployer2 is Ownable, ISafuDeployer {
    IDividendTrackerDeployer public dividendDeployer;

    constructor(address _dividendDeployer) {
        dividendDeployer = IDividendTrackerDeployer(_dividendDeployer);
    }

    function updateDividendDeployer(address newAddr) external onlyOwner {
        require(address(dividendDeployer) != newAddr, "Already Set");
        dividendDeployer = IDividendTrackerDeployer(newAddr);
    }

    function deploy(address creator, bytes calldata params, bytes calldata aux) external returns (address) {
        SafuDeployerTemplate2 c = new SafuDeployerTemplate2(creator, params);
        address dividend = dividendDeployer.deploy(creator, address(c), aux);

        c.udpateDividendTracker(dividend);
        c.transferOwnership(creator);

        return address(c);
    }
}
