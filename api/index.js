const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const {
    mintNft721,
    withdrawNft721FromBridge,
    getEthereumTransactionReceipt,
    getMeterTransactionReceipt,
    getEthereumTokenURI,
    hexToNumber,
    toChecksumAddress,
    ContractAddresses,
} = require('./contracts');
const { Datastore } = require('./db');

const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', (req, res) => {
    res.send('Meter Minter Api running...');
});

const mint721 = async (minter, uri) => {
    let rs = {
        tx: null,
        address: null,
        tokenId: null,
        tokenURI: null,
    };

    const txMint = await mintNft721(minter, uri);
    console.log('txMint', txMint);

    try {
        const txMintReceipt = await getMeterTransactionReceipt(txMint.events.Transfer.transactionHash);
        const destNftAddress = toChecksumAddress(txMintReceipt.logs[0].address);
        const destNftId = hexToNumber(txMintReceipt.logs[0].topics[3]);

        rs = {
            tx: txMint,
            address: destNftAddress,
            tokenId: destNftId,
            tokenURI: uri
        };

        await Datastore.addMinting(minter, destNftAddress, destNftId);
    } catch (e) {
        console.log('error', e);
    }

    return rs;
};

app.get('/config', async function (req, res) {
    const rs = {
        contracts: ContractAddresses
    }
    res.send(rs);
});


app.post('/mint', async function (req, res) {
    try {
        const { minter, uri, count, type } = req.body;

        let mintRs;
        if (type === 'ERC721') {
            mintRs = await mint721(minter, uri);
        } else if (type === 'ERC1155') {
        }

        console.log('mint res', mintRs);
        res.send(mintRs);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.post('/withdraw', async function (req, res) {
    let rs = {
        tx: null,
        address: null,
        tokenId: null,
    }
    try {
        const { receiverAddress, tokenAddress, tokenId, type } = req.body;

        // // get mapping
        // const destNft = burnReceipt // `${nftAddress}:${nftId}`
        const src = Datastore.getMapping(`${toChecksumAddress(tokenAddress)}:${tokenId}`);

        if (!src) {
            res.sendStatus(400);
        } else {
            const srcNftAddress = src.split(':')[0];
            const srcNftId = src.split(':')[1];
            rs.address = srcNftAddress;
            rs.tokenId = srcNftId;

            if (type === 'ERC721') {
                rs.tx = await withdrawNft721FromBridge(receiverAddress, srcNftAddress, Number(srcNftId));
            } else if (type === 'ERC1155') {
            }

            console.log('withdraw res', rs);
            res.send(rs);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.post('/deposit', async function (req, res) {
    let rs = {
        tx: null
    }
    try {
        const { receiverAddress, tokenAddress, tokenId, type } = req.body;
        const uri = await getEthereumTokenURI(tokenAddress, tokenId);

        if (type === 'ERC721') {
            rs = await mint721(receiverAddress, uri);
        } else if (type === 'ERC1155') {
        }

        await Datastore.addMapping(`${toChecksumAddress(rs.address)}:${rs.tokenId}`, `${toChecksumAddress(tokenAddress)}:${tokenId}`);

        console.log('deposit re', rs);

        res.send(rs);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.post('/account', async function (req, res) {
    try {
        const { address } = req.body;
        const mintings = await Datastore.getMintings(address);

        res.send(mintings);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.listen(port, async () => {
    // init datastore
    await Datastore.initOrbitDB();

    console.log(`Meter Minter Api listening at http://localhost:${port}`);
});
