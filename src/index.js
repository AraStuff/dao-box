const Ethers = require("ethers");
const { connect } = require("@aragon/connect"xz);
const companyTemplateAbi = require("../abis/companyTemplate.json");
const newTokenAndInstance =
  "newTokenAndInstance(string,string,string,address[],uint256[],uint64[3],uint64,bool)";

function defaultSigner() {
  const seed =
    "explain tackle mirror kit van hammer degree position ginger unfair soup bonus";
  const wallet = new Ethers.Wallet.fromMnemonic(seed);
  const ethersProvider = Ethers.getDefaultProvider("rinkeby");
  return wallet.connect(ethersProvider);
}

async function getDaoAddress(
  selectedFilter,
  templateContract,
  transactionHash
) {
  return new Promise((resolve, reject) => {
    const desiredFilter = templateContract.filters[selectedFilter]();

    templateContract.on(desiredFilter, (contractAddress, event) => {
      if (event.transactionHash === transactionHash) {
        resolve(contractAddress);
      }
    });
  });
}

async function companyDao({
  tokenName = "Test Token",
  symbol = "TKN",
  daoId = "DAO" + Math.random(),
  holders = ["0xb4124cEB3451635DAcedd11767f004d8a28c6eE7"],
  balances = [String(1e18)],
  voteSettings = ["500000000000000000", "250000000000000000", "86400"],
  network = "rinkeby",
  ethersSigner = defaultSigner(),
} = {}) {
  const COMPANY_TEMPLATE_ADDRESS =
    network === "rinkeby"
      ? "0xA3809a525B92a8A290E5d704f9Be6B5046506A7b"
      : "0xd737632caC4d039C9B0EEcc94C12267407a271b5";

  const companyTemplateContract = new Ethers.Contract(
    COMPANY_TEMPLATE_ADDRESS,
    companyTemplateAbi,
    ethersSigner
  );

  const tx = await companyTemplateContract[newTokenAndInstance](
    tokenName,
    symbol,
    daoId,
    holders,
    balances,
    voteSettings,
    0,
    true
  );

  const daoAddress = await getDaoAddress(
    "DeployDao",
    companyTemplateContract,
    tx.hash
  );

  const org = await connect(daoAddress, "ethereum", { network: network });
  const apps = await org.apps();
  const permissions = await org.permissions();
  const acl = permissions.filter(
    (p) =>
      p.roleHash ===
      `0x0b719b33c83b8e5d300c521cb8b54ae9bd933996a14bef8c2f4e0285d2d2400a`
  )[0].appAddress;

  return {
    dao: daoAddress,
    token_manager: apps.find((app) => app.name === "token-manager").address,
    voting: apps.find((app) => app.name === "voting").address,
    agent: apps.find((app) => app.name === "agent").address,
    finance: apps.find((app) => app.name === "finance").address,
    acl: acl,
  };
}

module.exports = { companyDao };
