const { defaultSigner } = require("./helpers/signers");
const { companyDao } = require("./templates/companyDao");

const {
  calculateNewProxyAddress,
  getDefaultProvider,
  getDefaultApps,
  getDaoAddress,
} = require("./helpers/addressHelpers");

const {
  execAppMethod,
  createVote,
  createPermission,
  installApp,
  calcPayload,
} = require("./helpers/installHelpers");


module.exports = {
  calculateNewProxyAddress,
  getDefaultProvider,
  getDefaultApps,
  getDaoAddress,
  execAppMethod,
  createVote,
  createPermission,
  installApp,
  calcPayload,
  defaultSigner,
  companyDao,
};
