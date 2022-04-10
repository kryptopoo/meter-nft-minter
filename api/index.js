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

// app.get('/contracts/MeterNft721', (req, res) => {
//     const contractFilePath = path.resolve(__dirname, 'contracts', 'MeterNft721.json');
//     const contractFileJson = fs.readFileSync(contractFilePath, 'UTF-8');

//     res.send(contractFileJson);
// });

// app.get('/contracts', (req, res) => {
//     res.send({
//         meterNft721: '0x8a9b15012E28bF022702A01D4032858b420E862d',
//         meterNft1155: '0x0'
//     });
// });

const mint721 = async (minter, uri) => {
    let rs = {
        tx: null,
        address: null,
        tokenId: null
    };

    const txMint = await mintNft721(minter, uri);
    console.log('txMint', txMint);

    try {
        const txMintReceipt = await getMeterTransactionReceipt(txMint.events.Transfer.transactionHash);
        console.log('txMintReceipt', txMintReceipt);
        const destNftAddress = toChecksumAddress(txMintReceipt.logs[0].address);
        const destNftId = hexToNumber(txMintReceipt.logs[0].topics[3]);
        console.log('destNftAddress', destNftAddress);
        console.log('destNftId', destNftId);

        rs = {
            tx: txMint,
            address: destNftAddress,
            tokenId: destNftId
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
        console.log('mint req', req.body);

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
        tx: null
    }
    try {
        console.log('withdraw req', req.body);

        const { receiverAddress, tokenAddress, tokenId, type } = req.body;

        // // get mapping
        // const destNft = burnReceipt // `${nftAddress}:${nftId}`
        const src = Datastore.getMapping(`${toChecksumAddress(tokenAddress)}:${tokenId}`);
        console.log('src ', src);

        if (!src) {
            res.sendStatus(400);
        } else {
            const srcNftAddress = src.split(':')[0];
            const srcNftId = src.split(':')[1];
            // const srcHash = src.split(':')[2];
            console.log('srcNftAddress', srcNftAddress);
            console.log('srcNftId', srcNftId);
            // console.log('srcHash', srcHash);

            // const srcNftAddress = '0x6563A2F98A9452d9693A013c0D0531747b5B46ee';
            // const srcNftId = 1;

      
            if (type === 'ERC721') {
                rs.tx = await withdrawNft721FromBridge(receiverAddress, srcNftAddress, Number(srcNftId));
                console.log('withdraw tx', rs.tx );
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
        console.log('deposit req', req.body);

        const { receiverAddress, tokenAddress, tokenId, type } = req.body;

        // // get sender address
        // const txReceipt = await getEthereumTransactionReceipt(txHash);
        // console.log('txReceipt', txReceipt);

        // const minter = receiverAddress
        const uri = await getEthereumTokenURI(tokenAddress, tokenId);
        console.log('minter', receiverAddress);
        console.log('uri', uri);

        if (type === 'ERC721') {
            rs.tx = await mint721(receiverAddress, uri);
        } else if (type === 'ERC1155') {
        }

        await Datastore.addMapping(`${toChecksumAddress(rs.tx.address)}:${rs.tx.tokenId}`, `${toChecksumAddress(tokenAddress)}:${tokenId}`);

        console.log('deposit res', `${rs.tx.address}:${rs.tx.tokenId}`);

        res.send(rs);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.post('/account', async function (req, res) {
    try {
        console.log('account req', req.body);

        const { address } = req.body;

        const mintings = await Datastore.getMintings(address);

        console.log('account res', mintings);
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
