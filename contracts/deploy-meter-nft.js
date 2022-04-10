const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { deploy } = require('./deploy');

// // example
// const provider = new HDWalletProvider({
//     mnemonic: {
//         phrase: 'dice bicycle thing clarify cotton manage pigeon blue patch key pudding town first symptom destroy'
//     },
//     providerOrUrl: 'https://rpctest.meter.io'
// });


// address:     0x0A3a5B133B845b43103e8347fFFD1F9baF4eC4A1
// privatekey:  c2a2bdd5b50c54ecc872f4150e336a03c2630a426f9a1bec69caf8444e524504
const provider = new HDWalletProvider({
    privateKeys: ['c2a2bdd5b50c54ecc872f4150e336a03c2630a426f9a1bec69caf8444e524504'],
    providerOrUrl: 'https://rpctest.meter.io'
});
const web3 = new Web3(provider);

async function main() {
    await deploy(web3, 'MeterNft721.sol');
    // await deploy(web3, 'MeterNft1155.sol');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
