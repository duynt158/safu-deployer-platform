// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IDividendTrackerDeployer {
    function deploy(address creator, address impleToken, bytes calldata params) external returns (address);
}
