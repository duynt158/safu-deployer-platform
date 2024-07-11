// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IDividendTracker {
    function setTokenBalance(address account) external;
    function process(uint256 gas) external returns (uint256, uint256, uint256);
}
