var fs = require('fs')
const BN = require('bignumber.js')

const { syncDeployInfo, deployContract, deployContractAndProxy } = require('./deploy')
const { addressZero, bytes32Zero, maxUint256,
  WBNB, PancakeRouter, PancakeFactory, USDT, 
  SafuDeployer, SafuDeployerProxy, SafuDeployer1, SafuDeployer2, DividendTrackerDeployer, DividendTracker, KissLPLocker } = require('./const')

const deploy_bsctestnet = async (web3, deployer, accounts, specialAccounts) => {
    let network = 'bsctestnet'
    const { owner, proxyAdmin, fee1, fee2 } = specialAccounts

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

    if (1) {
      wbnbInfo = {
        name: "WBNB",
        imple: '0xae13d989dac2f0debff460ac112a837c89baa7cd'
      }
      totalRet = syncDeployInfo(network, "WBNB", wbnbInfo, totalRet)

      factoryInfo = {
        name: "PancakeFactory",
        imple: "0x41939fe2547f3140b90e056fb42af81d423435ad"
      }
      totalRet = syncDeployInfo(network, "PancakeFactory", factoryInfo, totalRet)

      routerInfo = {
        name: "PancakeRouter",
        imple: "0x1Ed675D5e63314B760162A3D1Cae1803DCFC87C7"
      }
      totalRet = syncDeployInfo(network, "PancakeRouter", routerInfo, totalRet)

      if (usdtInfo === undefined) {
        usdtInfo = await deployContract(deployer, "USDT", USDT)
        totalRet = syncDeployInfo(network, "USDT", usdtInfo, totalRet)
      }

      safuDeployer1Info = await deployContract(deployer, "SafuDeployer1", SafuDeployer1)
      totalRet = syncDeployInfo(network, "SafuDeployer1", safuDeployer1Info, totalRet)

      dividendTrackerImpleInfo = await deployContract(deployer, "DividendTracker", DividendTracker)
      totalRet = syncDeployInfo(network, "DividendTracker", dividendTrackerImpleInfo, totalRet)

      dividendTrackerDeployerInfo = await deployContract(deployer, "DividendTrackerDeployer", DividendTrackerDeployer, dividendTrackerImpleInfo.imple, proxyAdmin)
      totalRet = syncDeployInfo(network, "DividendTrackerDeployer", dividendTrackerDeployerInfo, totalRet)

      safuDeployer2Info = await deployContract(deployer, "SafuDeployer2", SafuDeployer2, dividendTrackerDeployerInfo.imple)
      totalRet = syncDeployInfo(network, "SafuDeployer2", safuDeployer2Info, totalRet)

      safuDeployerInfo = await deployContractAndProxy(deployer, "SafuDeployer", SafuDeployer, SafuDeployerProxy, proxyAdmin,
                "SafuDeployer_init",
                ["address[]", "uint256[]", "address[]", "uint256[]"],
                [[fee1, fee2], [6000, 4000], [safuDeployer1Info.imple, safuDeployer2Info.imple], ["200000000000000000", "240000000000000000"]],
                (t) => {
                  totalRet = syncDeployInfo(network, "SafuDeployer", {name: 'SafuDeployer', imple: t, ...safuDeployerInfo}, totalRet)
                })
      totalRet = syncDeployInfo(network, "SafuDeployer", safuDeployerInfo, totalRet)

      lpLockerInfo = await deployContract(deployer, "KissLPLocker", KissLPLocker, [fee1, fee2], [6000, 4000], '20000000000000000', [owner], routerInfo.imple, safuDeployerInfo.proxy)
      totalRet = syncDeployInfo(network, "KissLPLocker", lpLockerInfo, totalRet)

      // let deployerContract = await SafuDeployer.at(safuDeployerInfo.proxy)
      // await deployerContract.updateDeployers([safuDeployer1Info.imple, safuDeployer2Info.imple])

    } else if (0) { // upgrade proxy implementation
      let updateManInfo = await deployContract(deployer, "SafuDeployer", SafuDeployer) // 0xA6e13394c92d52E374375c94a93B35137E18ef88
      console.log(updateManInfo)
      let proxyContract = await SafuDeployerProxy.at(safuDeployerInfo.proxy)
      await proxyContract.upgradeTo(updateManInfo.imple)
    } else if (0) {
      let deployerContract = await SafuDeployer.at(safuDeployerInfo.proxy)
      console.log('Updating parameters')
      console.log(await deployerContract.updateTemplateFee(['200000000000000', '240000000000000']))
    }
}

module.exports = { deploy_bsctestnet }
