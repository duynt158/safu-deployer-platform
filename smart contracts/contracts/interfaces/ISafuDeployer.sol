// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ISafuDeployer {
    function deploy(address creator, bytes calldata params, bytes calldata aux) external returns (address);
}
