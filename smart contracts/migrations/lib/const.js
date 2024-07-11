const BN = require('bignumber.js')

const addressZero = '0x0000000000000000000000000000000000000000'
const bytes32Zero = '0x0000000000000000000000000000000000000000000000000000000000000000'
const maxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

const WBNB = artifacts.require("WBNB")
const PancakeRouter = artifacts.require("PancakeRouter")
const PancakeFactory = artifacts.require("PancakeFactory")

const USDT = artifacts.require("USDT")
const SafuDeployer = artifacts.require('SafuDeployer')
const SafuDeployerProxy = artifacts.require('SafuDeployerProxy')
const SafuDeployer1 = artifacts.require('SafuDeployer1')
const SafuDeployer2 = artifacts.require('SafuDeployer2')
const DividendTrackerDeployer = artifacts.require('DividendTrackerDeployer')
const DividendTracker = artifacts.require("DividendTracker")
const KissLPLocker = artifacts.require("KissLPLocker")

module.exports = {
    addressZero, bytes32Zero, maxUint256,
    WBNB, PancakeRouter, PancakeFactory, USDT,
    SafuDeployer, SafuDeployerProxy, SafuDeployer1, SafuDeployer2, DividendTrackerDeployer, DividendTracker, KissLPLocker
};
