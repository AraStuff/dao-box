const Ethers = require("ethers");

function defaultSigner() {
  const seed = "explain tackle mirror kit van hammer degree position ginger unfair soup bonus";
  const wallet = new Ethers.Wallet.fromMnemonic(seed);
  const ethersProvider = Ethers.getDefaultProvider("rinkeby");
  return wallet.connect(ethersProvider);
}

exports.defaultSigner = {
    defaultSigner
}
