// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ISafuDeployerBaseTemplate {
    function identifier() external view returns (string memory);
    function uniswapV2Pair() external view returns (address);
}