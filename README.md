# dao-box

node libary for spinning up DAOs from node projects

## usage
0. install the library
```
yarn add dao-box
```

1. import the template from the package

```javascript
const { companyDao } = require('dao-box')
```

2. each template has default parameters. Calling the function with an empty object returns a DAO owned by the deployer account found in the devchain

```javascript
const dao = await companyDao({})
console.log(`https://rinkeby.aragon.org/#/${dao}`)
```

3. any of the default parameters can be overridden by passing them into the object

```javascript
const dao = await companyDao({tokenName: "Matias Token", symbol: "BCC"})
console.log(`https://rinkeby.aragon.org/#/${dao}`)
```

## options

```javascript
{
  tokenName: "Test Token",
  symbol: "TKN",
  daoId: "DAO" + Math.random(),
  holders: ["0xb4124cEB3451635DAcedd11767f004d8a28c6eE7"],
  balances: [String(1e18)],
  voteSettings: ["500000000000000000", "250000000000000000", "86400"],
  network: "rinkeby",
  ethersSigner: defaultSigner()
}
```