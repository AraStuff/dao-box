const Ethers = require("ethers");
const { connect } = require("@aragon/connect");
const { keccak256 } = require('web3-utils');
const RLP = require('rlp');

getDefaultApps = async (dao, network) => {
  const org = await connect(dao, "ethereum", { network: network });
  const apps = await org.apps();
  const permissions = await org.permissions();
  const acl = permissions.filter(
    (p) =>
      p.roleHash ===
      `0x0b719b33c83b8e5d300c521cb8b54ae9bd933996a14bef8c2f4e0285d2d2400a`
  )[0].appAddress;

  return {
    token_manager: apps.find((app) => app.name === "token-manager").address,
    voting: apps.find((app) => app.name === "voting").address,
    agent: apps.find((app) => app.name === "agent").address,
    finance: apps.find((app) => app.name === "finance").address,
    acl: acl,
  };
};

buildNonceForAddress = async (_address, _index, provider) => {
  const txCount = await provider.getTransactionCount(_address);
  return `0x${(txCount + _index).toString(16)}`;
};
calculateNewProxyAddress = (_daoAddress, _nonce) => {
  const rlpEncoded = RLP.encode([_daoAddress, _nonce]);
  const contractAddressLong = keccak256(rlpEncoded);
  const contractAddress = `0x${contractAddressLong.substr(-40)}`;

  return contractAddress;
};

counterfactualAddress = async (_address, _index, network) => {
  const provider = Ethers.getDefaultProvider(network);
  const nonce = await buildNonceForAddress(_address, _index, provider);
  return calculateNewProxyAddress(_address, nonce);
};

getDaoAddress = async (selectedFilter, templateContract, transactionHash) => {
  return new Promise((resolve, reject) => {
    const desiredFilter = templateContract.filters[selectedFilter]();

    templateContract.on(desiredFilter, (contractAddress, event) => {
      if (event.transactionHash === transactionHash) {
        resolve(contractAddress);
      }
    });
  });
};

module.exports = {
    calculateNewProxyAddress,
    getDefaultProvider,
    getDefaultApps,
    getDaoAddress
}