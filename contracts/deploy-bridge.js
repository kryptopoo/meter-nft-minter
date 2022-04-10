const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { deploy } = require('./deploy');

// address:     0x0A3a5B133B845b43103e8347fFFD1F9baF4eC4A1
// privatekey:  c2a2bdd5b50c54ecc872f4150e336a03c2630a426f9a1bec69caf8444e524504
const provider = new HDWalletProvider({
    privateKeys: ['c2a2bdd5b50c54ecc872f4150e336a03c2630a426f9a1bec69caf8444e524504'],
    providerOrUrl: 'https://ropsten.infura.io/v3/ec65f5a732a44dce9358710ecf0ef5fe'
});
const web3 = new Web3(provider);

async function main() {
    const accounts = await web3.eth.getAccounts();
    const validatorAddress = accounts[0];

    if (validatorAddress) await deploy(web3, 'Bridge721.sol', [validatorAddress]);
    else console.log('deploy failed');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
