const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { deploy } = require('./deploy');

// address: 0x06e896230279EF9054700EbEEEb646A64C83E6f5
// privatekey: 74080a50c0b6bc436a1eae32b2214bd9df2b4877ad365901f277cd7ac97edd2b
const provider = new HDWalletProvider({
    privateKeys: ['74080a50c0b6bc436a1eae32b2214bd9df2b4877ad365901f277cd7ac97edd2b'],
    providerOrUrl: 'https://ropsten.infura.io/v3/ec65f5a732a44dce9358710ecf0ef5fe'
});
const web3 = new Web3(provider);

async function main() {
    await deploy(web3, 'AnimalLetterNft721.sol');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
