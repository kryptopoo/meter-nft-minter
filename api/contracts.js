const Web3 = require('web3');
const ethers = require('ethers');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const dotenv = require('dotenv');
dotenv.config();

const Providers = {
    ethereum: new HDWalletProvider({
        privateKeys: [process.env.ETHEREUM_PRIVATE_KEY_VALIDATOR],
        providerOrUrl: process.env.ETHEREUM_PROVIDER_URL
    }),
    meter: new HDWalletProvider({
        privateKeys: [process.env.METER_PRIVATE_KEY_DEPLOYER],
        providerOrUrl: process.env.METER_PROVIDER_URL
    })
};

const ethWeb3 = new Web3(Providers.ethereum);
const meterWeb3 = new Web3(Providers.meter);

const Nft721Json = require('./contracts/artifacts/MeterNft721.json');
// const Nft1155Json = require('./contracts/artifacts/MeterNft1155.json');
const Bridge721Json = require('./contracts/artifacts/Bridge721.json');

const ContractAddresses = {
    NFT721: process.env.METER_CONTRACT_NFT721,
    BRIDGE:  process.env.ETHEREUM_CONTRACT_BRIDGE
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
    return Constracts.NFT721.methods.mint(toAddress, metadataUrl).send({
        from: fromAddress,
        gas: process.env.METER_GAS,
        gasPrice: process.env.METER_GAS_PRICE
    });
};

const withdrawNft721FromBridge = async (receiverAddress, nftAddress, nftTokenId) => {
    const accounts = await ethWeb3.eth.getAccounts();
    const fromAddress = accounts[0];
    const chainRoute = '3-83'; // ropsten testnet chainid
    const nonce = 8888; // hardcode
    const hash = await Constracts.BRIDGE.methods.hashMessage(receiverAddress, nftAddress, nftTokenId, chainRoute, nonce).call();
    const { v, r, s } = ethWeb3.eth.accounts.sign(hash, privateKey);
    return Constracts.BRIDGE.methods.withdraw(receiverAddress, nftAddress, nftTokenId, chainRoute, nonce, v, r, s).send({
        from: fromAddress,
        gas: process.env.ETHEREUM_GAS,
        gasPrice: process.env.ETHEREUM_GAS_PRICE
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