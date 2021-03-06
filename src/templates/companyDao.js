const Ethers = require("ethers");
const companyTemplateAbi = require("../../abis/companyTemplate.json");
const { defaultSigner } = require("../helpers/signers");
const { getDaoAddress } = require("../helpers/getDaoAddress");

companyDao = async ({
  tokenName = "Test Token",
  symbol = "TKN",
  daoId = "DAO" + Math.random(),
  holders = ["0xb4124cEB3451635DAcedd11767f004d8a28c6eE7"],
  balances = [String(1e18)],
  voteSettings = ["500000000000000000", "250000000000000000", "86400"],
  network = "rinkeby",
  ethersSigner = defaultSigner(),
} = {}) => {

  const newTokenAndInstance =
    "newTokenAndInstance(string,string,string,address[],uint256[],uint64[3],uint64,bool)";

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

  return daoAddress;
};

module.exports = {
  companyDao
}