const Web3 = require('web3');
const ethers = require('ethers');
const HDWalletProvider = require('@truffle/hdwallet-provider');

// address:     0x0A3a5B133B845b43103e8347fFFD1F9baF4eC4A1
const privateKey = 'c2a2bdd5b50c54ecc872f4150e336a03c2630a426f9a1bec69caf8444e524504';

const Providers = {
    ethereum: new HDWalletProvider({
        privateKeys: [privateKey],
        providerOrUrl: 'https://ropsten.infura.io/v3/ec65f5a732a44dce9358710ecf0ef5fe'
    }),
    meter: new HDWalletProvider({
        privateKeys: [privateKey],
        providerOrUrl: 'https://rpctest.meter.io'
    })
};

const ethWeb3 = new Web3(Providers.ethereum);
const meterWeb3 = new Web3(Providers.meter);

const Nft721Json = require('./contracts/artifacts/MeterNft721.json');
// const Nft1155Json = require('./contracts/artifacts/MeterNft1155.json');
const Bridge721Json = require('./contracts/artifacts/Bridge721.json');

const ContractAddresses = {
    NFT721: '0x7B61c90AB3E43f47596B62BA5EcB639Ec387c6c7',
    BRIDGE: '0x620777774B01b66061a93210aa1251c658d5d2f0'
}

const Constracts = {
    NFT721: new meterWeb3.eth.Contract(Nft721Json.abi, ContractAddresses.NFT721), // MTR
    // NFT1155: new meterWeb3.eth.Contract(Nft1155Json.abi, '0x5281D5abFf76a40E883216D474dB6337c12B0019'), // MTR
    BRIDGE: new ethWeb3.eth.Contract(Bridge721Json.abi, ContractAddresses.BRIDGE) // eth
};

// Meter mint NFT
const mintNft721 = async (toAddress, metadataUrl) => {
    const accounts = await meterWeb3.eth.getAccounts();
    const fromAddress = accounts[0];
    console.log('from', fromAddress);
    return Constracts.NFT721.methods.mint(toAddress, metadataUrl).send({
        from: fromAddress,
        gas: '4000000',
        gasPrice: '20000000000'
    });
};

// const burnNft721 = async (nftAddress, nftTokenId) => {
//     const accounts = await meterWeb3.eth.getAccounts();
//     const fromAddress = accounts[0];
//     console.log('from', fromAddress)
//     return Constracts.NFT721.methods.burn(nftAddress, nftTokenId).send({
//         from: fromAddress,
//         gas: '4000000',
//         gasPrice: '20000000000'
//     });
// }

const withdrawNft721FromBridge = async (receiverAddress, nftAddress, nftTokenId) => {
    const accounts = await ethWeb3.eth.getAccounts();
    const fromAddress = accounts[0];
    console.log('fromAddress', fromAddress)

    const chainRoute = '3-83'; // ropsten testnet chainid
    const nonce = 8888; // hardcode
    const hash = await Constracts.BRIDGE.methods.hashMessage(receiverAddress, nftAddress, nftTokenId, chainRoute, nonce).call();
    console.log('hash', hash)

    const { v, r, s } = ethWeb3.eth.accounts.sign(hash, privateKey);
    console.log('{ v, r, s } ', { v, r, s } )
   
    return Constracts.BRIDGE.methods.withdraw(receiverAddress, nftAddress, nftTokenId, chainRoute, nonce, v, r, s).send({
        from: fromAddress,
        gas: '4000000',
        gasPrice: '20000000000'
    });
};

const getEthereumTransactionReceipt = async (hash) => {
    return await ethWeb3.eth.getTransactionReceipt(hash);
};

const getMeterTransactionReceipt = async (hash) => {
    return await meterWeb3.eth.getTransactionReceipt(hash);
};

const getEthereumTokenURI = async (address, tokenId) => {
    const contract = new ethWeb3.eth.Contract(Nft721Json.abi, address);
    return await contract.methods.tokenURI(tokenId).call();
};

const hexToNumber = (value) => {
    return Web3.utils.hexToNumber(value);
};

const toChecksumAddress = (value) => {
    return Web3.utils.toChecksumAddress(value);
};

module.exports = {
    ContractAddresses: ContractAddresses,
    mintNft721: mintNft721,
    withdrawNft721FromBridge: withdrawNft721FromBridge,
    getEthereumTransactionReceipt: getEthereumTransactionReceipt,
    getMeterTransactionReceipt: getMeterTransactionReceipt,
    getEthereumTokenURI: getEthereumTokenURI,
    hexToNumber: hexToNumber,
    toChecksumAddress: toChecksumAddress
};

// test = async () => {
//     const accounts = await ethWeb3.eth.getAccounts();
//     const fromAddress = accounts[0];
//     var signature = ethWeb3.eth.accounts.sign('0x0f14c070448f64d322fc9b13effe9ed4dd32da29ace26edeefab58deae484aae', privateKey);
//     console.log( 'signature: ', signature);

//     // var hash = '0x8e886b4721373380fc194bdd50024087329bfb550cfc09886f4ecbcac09702e7'
//     // var tx = await getMeterTransactionReceipt(hash)
//     // console.log(tx)
// }

// test()