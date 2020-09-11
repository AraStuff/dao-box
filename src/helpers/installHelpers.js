const { keccak256 } = require("web3-utils");
const { encodeActCall, execAppMethod } = require("mathew-aragon-toolkit");
const { encodeCallScript } = require("@aragon/test-helpers/evmScript");

async function calcPayload(signature, args) {
  payload = await encodeActCall(signature, args);
  return payload;
}

async function installApp(dao, params) {
  const data = await encodeActCall(
    "newAppInstance(bytes32,address,bytes,bool)",
    params
  );
  return {
    to: dao,
    calldata: data,
  };
}

async function createPermission(acl, params) {
  params[2] = keccak256(params[2]);
  const data = await encodeActCall(
    "createPermission(address,address,bytes32,address)",
    params
  );
  return {
    to: acl,
    calldata: data,
  };
}

async function createVote(dao, voting, script, network) {
  const encodedScript = await encodeCallScript(script);

  await execAppMethod(
    dao,
    voting,
    "newVote",
    [encodedScript, `insall script`],
    () => {},
    network
  );
  return `Vote at http://${network}.aragon.org/#/${dao}/${voting}`;
}

module.exports = {
  execAppMethod,
  createVote,
  createPermission,
  installApp,
  calcPayload
}
