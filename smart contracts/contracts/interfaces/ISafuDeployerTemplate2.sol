// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISafuDeployerTemplate2 is IERC20 {
    function decimals() external view returns (uint8);
    function isExcludedFromRewards(address user) external view returns (bool);
}
