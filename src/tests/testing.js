const { companyDao } = require('../index.js')
const Ora = require('ora');

const spinner = Ora('deploying DAO...')
async function main() {
    spinner.start();
    const reciept = await companyDao({tokenName: "Matias Token", symbol: "BCC"})
    spinner.succeed(`DAO: https://rinkeby.aragon.org/#/${reciept}`)
}

main()
    .then(() => {
        process.exit();
    })
    .catch((e) => {
        spinner.fail('DAO deployment fail')
        console.error(e);
        process.exit();
    });