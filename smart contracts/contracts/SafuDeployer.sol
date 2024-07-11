// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ISafuDeployer.sol";
import "./interfaces/ISafuDeployerBaseTemplate.sol";

contract SafuDeployer is Initializable, OwnableUpgradeable, PausableUpgradeable {
    enum TEMPLATE_ID {
        NULL,
        TAX_FEE,
        REFLECTION
    }

    struct DeployHistory {
        uint256 id;
        address creator;
        address deployedAddress;
        uint256 timestamp;
        TEMPLATE_ID template;
        uint256 cost;
        bytes param;
        bytes auxParam;
    }

    uint256 constant private RESOLUTION = 10000;

    address[] public feeWallets;
    uint256[] public feeRates;

    uint256[] public feeTemplates;
    ISafuDeployer[] public deployers;

    DeployHistory[] private deployHistory;
    uint256 public deployedCount;

    uint256 public refundErrorCounter;

    mapping(address => bool) public isKissToken;
    mapping(address => bool) public isKissTokenPair;

    event UpdateFeeInfo(address[] wallets, uint256[] rates);
    event UpdateTemplateFee(uint256[] fees);

    function SafuDeployer_init(address[] calldata _feeWallets, uint256[] calldata _feeRates, address[] calldata _deployerTemplates, uint256[] calldata _feeTemplates) external initializer {
        __SafuDeployer_init(_feeWallets, _feeRates, _deployerTemplates, _feeTemplates);
    }

    function __SafuDeployer_init(address[] calldata _feeWallets, uint256[] calldata _feeRates, address[] calldata _deployerTemplates, uint256[] calldata _feeTemplates) internal onlyInitializing {
        __Ownable_init();
        __Pausable_init();

        // custom code here
        uint256 i;

        require(_feeWallets.length > 0 && _feeWallets.length == _feeRates.length, "Invalid Params: 0x1");

        feeWallets = new address[](_feeWallets.length);
        feeRates = new uint256[](_feeRates.length);

        for (i = 0; i < _feeWallets.length; i ++) {
            feeWallets[i] = _feeWallets[i];
            feeRates[i] = _feeRates[i];
        }

        emit UpdateFeeInfo(feeWallets, feeRates);

        require(_feeTemplates.length >= 2, "Invalid Params: 0x2");
        require(_deployerTemplates.length == _feeTemplates.length, "Invalid Params: 0x10");

        feeTemplates = new uint256[](_feeTemplates.length);
        deployers = new ISafuDeployer[](_deployerTemplates.length);

        for (i = 0; i < _feeTemplates.length; i ++) {
            deployers[i] = ISafuDeployer(_deployerTemplates[i]);
            feeTemplates[i] = _feeTemplates[i];
        }

        emit UpdateTemplateFee(feeTemplates);
    }

    receive() external payable {
    }

    function pause(bool set) external onlyOwner {
        if (set) {
            _pause();
        } else {
            _unpause();
        }
    }

    function updateFeeInfo(address[] calldata _feeWallets, uint256[] calldata _feeRates) external onlyOwner {
        require(_feeWallets.length > 0 && _feeWallets.length == _feeRates.length, "Invalid Params: 0x3");

        feeWallets = new address[](_feeWallets.length);
        feeRates = new uint256[](_feeRates.length);

        uint256 i;
        for (i = 0; i < _feeWallets.length; i ++) {
            feeWallets[i] = _feeWallets[i];
            feeRates[i] = _feeRates[i];
        }

        emit UpdateFeeInfo(feeWallets, feeRates);
    }

    function updateTemplateFee(uint256[] calldata _feeTemplates) external onlyOwner {
        require(_feeTemplates.length >= 2, "Invalid Params: 0x4");

        feeTemplates = new uint256[](_feeTemplates.length);

        uint256 i;
        for (i = 0; i < _feeTemplates.length; i ++) {
            feeTemplates[i] = _feeTemplates[i];
        }

        emit UpdateTemplateFee(feeTemplates);
    }

    function updateDeployers(address[] calldata _deployers) external onlyOwner {
        deployers = new ISafuDeployer[](_deployers.length);

        uint256 i;
        for (i = 0; i < _deployers.length; i ++) {
            deployers[i] = ISafuDeployer(_deployers[i]);
        }
    }

    function deploy(TEMPLATE_ID templateId, bytes calldata params, bytes calldata aux) external payable {
        address creator = msg.sender;

        require(templateId == TEMPLATE_ID.TAX_FEE || 
                templateId == TEMPLATE_ID.REFLECTION,
                "Template Not Supported");

        ISafuDeployer deployer = deployers[uint256(templateId) - 1];

        address deployedAddress = deployer.deploy(creator, params, aux);
        uint256 feeAmount = feeTemplates[uint256(templateId) - 1];

        deployHistory.push(DeployHistory({
            id: deployedCount,
            creator: creator,
            deployedAddress: deployedAddress,
            timestamp: block.timestamp,
            template: templateId,
            cost: feeAmount,
            param: params,
            auxParam: aux
        }));

        isKissToken[deployedAddress] = true;
        isKissTokenPair[ISafuDeployerBaseTemplate(deployedAddress).uniswapV2Pair()] = true;

        deployedCount ++;

        require(msg.value >= feeAmount, "You should pay");
        uint256 remnant = msg.value - feeAmount;
        if (remnant > 0) {
            (bool success, ) = payable(msg.sender).call{value: remnant}("");
            if (!success) {
                refundErrorCounter ++;
            }
        }

        distributePayment(feeAmount);
    }

    function distributePayment(uint256 feeAmount) internal {
        uint256 i;
        for (i = 0; i < feeWallets.length; i ++) {
            uint256 share = feeRates[i] * feeAmount / RESOLUTION;
            address feeRx = feeWallets[i];

            if (share > 0) {
                (bool success,) = payable(feeRx).call{value: share}("");
                if (!success) {
                    continue;
                }
            }
        }
    }

    function recoverETH(address to) external payable onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to recover");

        (bool success,) = payable(to).call{value: balance}("");
        require(success, "Not Recovered ETH");
    }

    function recoverToken(address token, address to) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No token to recover");

        IERC20(token).transfer(to, balance);
    }

    function getDeployHistory() external view returns (DeployHistory[] memory) {
        DeployHistory[] memory ret = new DeployHistory[](deployHistory.length);
        uint256 i;
        for (i = 0; i < deployHistory.length; i ++) {
            ret[i] = deployHistory[i];
        }

        return ret;
    }

    function registerKissToken(address[] calldata tokens, bool set) external onlyOwner {
        require(tokens.length > 0, "Invalid Parameters");

        uint256 i;
        for (i = 0; i < tokens.length; i ++) {
            address token = tokens[i];
            address pair = ISafuDeployerBaseTemplate(token).uniswapV2Pair();

            isKissToken[token] = set;
            isKissTokenPair[pair] = set;
        }
    }
}
