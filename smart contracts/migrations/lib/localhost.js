var fs = require('fs')
const BN = require('bignumber.js')

const { syncDeployInfo, deployContract, deployContractAndProxy } = require('./deploy')
const { addressZero, bytes32Zero, maxUint256,
  WBNB, PancakeRouter, PancakeFactory, USDT, 
  SafuDeployer, SafuDeployerProxy, SafuDeployer1, SafuDeployer2, DividendTrackerDeployer, DividendTracker, KissLPLocker } = require('./const')

const deploy_localhost = async (web3, deployer, accounts, specialAccounts) => {
    let network = 'localhost'
    const { owner, proxyAdmin, pancakeFeeSetter } = specialAccounts

    let totalRet = []
    try {
      let readInfo = fs.readFileSync(`migrations/deploy-${network}.json`);
      totalRet = JSON.parse(readInfo);
    } catch(err) {
      console.log(`${err.message}`);
    }
    // console.log(totalRet);

    let wbnbInfo = totalRet.find(t => t.name === "WBNB")
    let factoryInfo = totalRet.find(t => t.name === "PancakeFactory")
    let routerInfo = totalRet.find(t => t.name === "PancakeRouter")

    let usdtInfo = totalRet.find(t => t.name === "USDT")
    let safuDeployerInfo = totalRet.find(t => t.name === "SafuDeployer")
    let safuDeployer1Info = totalRet.find(t => t.name === "SafuDeployer1")
    let safuDeployer2Info = totalRet.find(t => t.name === "SafuDeployer2")
    let dividendTrackerImpleInfo = totalRet.find(t => t.name === "DividendTracker")
    let dividendTrackerDeployerInfo = totalRet.find(t => t.name === "DividendTrackerDeployer")

    let lpLockerInfo = totalRet.find(t => t.name === 'KissLPLocker')

    wbnbInfo = await deployContract(deployer, "WBNB", WBNB)
    totalRet = syncDeployInfo(network, "WBNB", wbnbInfo, totalRet)

    factoryInfo = await deployContract(deployer, "PancakeFactory", PancakeFactory, pancakeFeeSetter)
    totalRet = syncDeployInfo(network, "PancakeFactory", factoryInfo, totalRet)

    routerInfo = await deployContract(deployer, "PancakeRouter", PancakeRouter, factoryInfo.imple, wbnbInfo.imple)
    totalRet = syncDeployInfo(network, "PancakeRouter", routerInfo, totalRet)

    let routerContract = await PancakeRouter.at(routerInfo.imple)
    let factoryContract = await PancakeFactory.at(factoryInfo.imple)

    let wethAddr = await routerContract.WETH()
    console.log('WETH:', wethAddr)

    console.log("Pancake Factory Pair HASH:", await factoryContract.INIT_CODE_PAIR_HASH())

    usdtInfo = await deployContract(deployer, "USDT", USDT)
    totalRet = syncDeployInfo(network, "USDT", usdtInfo, totalRet)

    safuDeployer1Info = await deployContract(deployer, "SafuDeployer1", SafuDeployer1)
    totalRet = syncDeployInfo(network, "SafuDeployer1", safuDeployer1Info, totalRet)

    dividendTrackerImpleInfo = await deployContract(deployer, "DividendTracker", DividendTracker)
    totalRet = syncDeployInfo(network, "DividendTracker", dividendTrackerImpleInfo, totalRet)

    dividendTrackerDeployerInfo = await deployContract(deployer, "DividendTrackerDeployer", DividendTrackerDeployer, dividendTrackerImpleInfo.imple, accounts[1])
    totalRet = syncDeployInfo(network, "DividendTrackerDeployer", dividendTrackerDeployerInfo, totalRet)

    safuDeployer2Info = await deployContract(deployer, "SafuDeployer2", SafuDeployer2, dividendTrackerDeployerInfo.imple)
    totalRet = syncDeployInfo(network, "SafuDeployer2", safuDeployer2Info, totalRet)

    safuDeployerInfo = await deployContractAndProxy(deployer, "SafuDeployer", SafuDeployer, SafuDeployerProxy, proxyAdmin,
              "SafuDeployer_init",
              ["address[]", "uint256[]", "address[]", "uint256[]"],
              [[accounts[1], accounts[2]], [6000, 4000], [safuDeployer1Info.imple, safuDeployer2Info.imple], ["200000000000000000", "240000000000000000"]]);
    totalRet = syncDeployInfo(network, "SafuDeployer", safuDeployerInfo, totalRet)

    lpLockerInfo = await deployContract(deployer, "KissLPLocker", KissLPLocker, [accounts[7], accounts[8]], [3000, 7000], '1000000000000000000', [accounts[0]], routerInfo.imple, safuDeployerInfo.proxy)
    totalRet = syncDeployInfo(network, "KissLPLocker", lpLockerInfo, totalRet)
}

module.exports = { deploy_localhost }
