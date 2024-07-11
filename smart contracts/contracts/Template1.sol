// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./pancake/PancakeRouter.sol";
import "./pancake/interfaces/IPancakeFactory.sol";
import "./interfaces/ISafuDeployer.sol";
import "./interfaces/ISafuDeployerBaseTemplate.sol";

contract SafuDeployerTemplate1 is ERC20, Ownable, ISafuDeployerBaseTemplate {
    string constant public identifier = "Safu Smart Deployer Template 1";
    // TOKENOMICS START ==========================================================>
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 public taxForLiquidity; // 0 = 0%
    uint256 public taxForMarketing; // 2500 = 25%
    uint256 public maxTxAmount;
    uint256 public maxWalletAmount;
    address public marketingWallet;

    uint256 constant private RESOLUTION = 10000;
    // TOKENOMICS END ============================================================>

    IPancakeRouter02 public uniswapV2Router;
    address public uniswapV2Pair;

    uint256 private _marketingReserves = 0;
    mapping(address => bool) private _isExcludedFromFee;
    uint256 public maxSellToAddToLP;
    uint256 public maxSellToAddToETH;
    bool inSwapAndLiquify;

    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiqudity
    );

    modifier lockTheSwap() {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(address _mintTo, bytes memory _params) ERC20("", "") {
        bytes memory decoded;
        uint256 _totalsupply;

        {
            uint256 _supply;
            (_name, _symbol, _decimals, _supply, decoded)
                = abi.decode(_params, (string, string, uint8, uint256, bytes));

            _totalsupply = _supply * 10 ** _decimals;
            _mint(_mintTo, _totalsupply);
        }
        {
            address _uniswapV2RouterAddress;
            uint256 _maxTxPercentage; // 100 = 1%
            (_uniswapV2RouterAddress, taxForLiquidity, taxForMarketing, _maxTxPercentage, decoded)
                    = abi.decode(decoded, (address, uint256, uint256, uint256, bytes));

            IPancakeRouter02 _uniswapV2Router = IPancakeRouter02(_uniswapV2RouterAddress);
            uniswapV2Pair = IPancakeFactory(_uniswapV2Router.factory()).createPair(address(this), _uniswapV2Router.WETH());
            uniswapV2Router = _uniswapV2Router;

            require(_maxTxPercentage <= 500, "Max Tx <= 5%");
            maxTxAmount = _totalsupply * _maxTxPercentage / RESOLUTION;
        }
        {
            uint256 _maxWalletPercentage; // 100 = 1%
            uint256 _sellToLiquidityPercentage; // 100 = 1%
            uint256 _sellToAddToETH; // 20 = 0.2%

            (_maxWalletPercentage, marketingWallet, _sellToLiquidityPercentage, _sellToAddToETH)
                    = abi.decode(decoded, (uint256, address, uint256, uint256));

            require(_maxWalletPercentage <= 500, "Max Wallet <= 5%");
            maxWalletAmount = _totalsupply * _maxWalletPercentage / RESOLUTION;

            maxSellToAddToLP = _totalsupply * _sellToLiquidityPercentage / RESOLUTION;
            maxSellToAddToETH = _totalsupply * _sellToAddToETH / RESOLUTION;
        }

        _isExcludedFromFee[address(uniswapV2Router)] = true;
        _isExcludedFromFee[_mintTo] = true;
        _isExcludedFromFee[marketingWallet] = true;
        _isExcludedFromFee[address(this)] = true;
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Moves `amount` of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     */
    function _transfer(address from, address to, uint256 amount) internal override {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(balanceOf(from) >= amount, "ERC20: transfer amount exceeds balance");

        if ((from == uniswapV2Pair || to == uniswapV2Pair) && !inSwapAndLiquify) {
            if (from != uniswapV2Pair) {
                uint256 contractLiquidityBalance = balanceOf(address(this)) - _marketingReserves;
                if (contractLiquidityBalance >= maxSellToAddToLP) {
                    _swapAndLiquify(maxSellToAddToLP);
                }
                if ((_marketingReserves) >= maxSellToAddToETH) {
                    _swapTokensForEth(maxSellToAddToETH);
                    _marketingReserves -= maxSellToAddToETH;
                    bool sent = payable(marketingWallet).send(address(this).balance);
                    require(sent, "Failed to send ETH");
                }
            }

            uint256 transferAmount;
            if (_isExcludedFromFee[from] || _isExcludedFromFee[to]) {
                transferAmount = amount;
            } 
            else {
                require(amount <= maxTxAmount, "ERC20: transfer amount exceeds the max transaction amount");
                if(from == uniswapV2Pair){
                    require((amount + balanceOf(to)) <= maxWalletAmount, "ERC20: balance amount exceeded max wallet amount limit");
                }

                uint256 marketingShare = ((amount * taxForMarketing) / RESOLUTION);
                uint256 liquidityShare = ((amount * taxForLiquidity) / RESOLUTION);
                transferAmount = amount - (marketingShare + liquidityShare);

                _marketingReserves += marketingShare;

                super._transfer(from, address(this), (marketingShare + liquidityShare));
            }
            super._transfer(from, to, transferAmount);
        } 
        else {
            super._transfer(from, to, amount);
        }
    }

    function _swapAndLiquify(uint256 contractTokenBalance) private lockTheSwap {
        uint256 half = (contractTokenBalance / 2);
        uint256 otherHalf = (contractTokenBalance - half);

        uint256 initialBalance = address(this).balance;

        _swapTokensForEth(half);

        uint256 newBalance = (address(this).balance - initialBalance);

        _addLiquidity(otherHalf, newBalance);

        emit SwapAndLiquify(half, newBalance, otherHalf);
    }

    function _swapTokensForEth(uint256 tokenAmount) private lockTheSwap {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();

        _approve(address(this), address(uniswapV2Router), tokenAmount);

        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            address(this),
            (block.timestamp + 300)
        );
    }

    function _addLiquidity(uint256 tokenAmount, uint256 ethAmount)
        private
        lockTheSwap
    {
        _approve(address(this), address(uniswapV2Router), tokenAmount);

        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0,
            0,
            owner(),
            block.timestamp
        );
    }

    function changeMarketingWallet(address newWallet)
        public
        onlyOwner
        returns (bool)
    {
        require(marketingWallet != newWallet, "Already Set");

        marketingWallet = newWallet;
        return true;
    }

    function updateFeeExempt(address[] calldata wallets, bool set)
        public
        onlyOwner
        returns (bool)
    {
        uint256 i;
        for (i = 0; i < wallets.length; i ++) {
            _isExcludedFromFee[wallets[i]] = set;
        }
        return true;
    }

    function isFeeExempt(address wallet) external view returns (bool) {
        return _isExcludedFromFee[wallet];
    }

    function changeTaxForLiquidityAndMarketing(uint256 _taxForLiquidity, uint256 _taxForMarketing)
        public
        onlyOwner
        returns (bool)
    {
        require((_taxForLiquidity+_taxForMarketing) <= RESOLUTION, "ERC20: total tax must not be greater than 100%");
        taxForLiquidity = _taxForLiquidity;
        taxForMarketing = _taxForMarketing;

        return true;
    }

    function changeMaxTxAmount(uint256 _maxTxAmount)
        public
        onlyOwner
        returns (bool)
    {
        require(maxTxAmount != _maxTxAmount, "Already Set");
        require(_maxTxAmount <= totalSupply() * 500 / RESOLUTION, "Max Tx <= 5%");
        maxTxAmount = _maxTxAmount;

        return true;
    }

    function changeMaxWalletAmount(uint256 _maxWalletAmount)
        public
        onlyOwner
        returns (bool)
    {
        require(maxWalletAmount != _maxWalletAmount, "Already Set");
        require(_maxWalletAmount <= totalSupply() * 500 / RESOLUTION, "Max Wallet <= 5%");
        maxWalletAmount = _maxWalletAmount;

        return true;
    }

    function changeSellPercentages(uint256 _addToLiquidity, uint256 _addToETH) public onlyOwner returns (bool) {
        require(_addToLiquidity + _addToETH <= RESOLUTION, "Token sell limit can't exceed the total supply");

        uint256 _totalsupply = totalSupply();
        maxSellToAddToLP = _totalsupply * _addToLiquidity / RESOLUTION;
        maxSellToAddToETH = _totalsupply * _addToETH / RESOLUTION;

        return true;
    }

    receive() external payable {}
}

contract SafuDeployer1 is ISafuDeployer {
    function deploy(address creator, bytes calldata params, bytes calldata) external returns (address) {
        SafuDeployerTemplate1 c = new SafuDeployerTemplate1(creator, params);

        c.transferOwnership(creator);

        return address(c);
    }
}
