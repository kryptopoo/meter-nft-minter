import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CIDString, Web3Storage } from 'web3.storage';
import { Contract, ethers } from 'ethers';
import { CHAIN_ID, NETWORK } from '../app.constants';
import { environment } from 'src/environments/environment';

const NFT721 = require('../../contracts/MeterNft721.json');
const Bridge721 = require('../../contracts/Bridge721.json');

// follow the standard of OpenSea
// https://docs.opensea.io/docs/metadata-standards
export interface NftMetadata {
    name: string;
    description: string;
    image: string; // imageURL
    external_url?: string;
    attributes: Array<NftAttribute>;
    creator?: string;
}

export interface NftAttribute {
    trait_type: string;
    value: string;
    display_type?: string;
}

export interface NftContract {
    abi: any;
    bytecode: any;
}

@Injectable({
    providedIn: 'root'
})
export class ContractService {
    private _storageClient: Web3Storage;
    private _bridgeAddress: string;

    constructor(private _httpClient: HttpClient) {
        this._storageClient = new Web3Storage({
            token: environment.web3StorageToken
        });
        this._bridgeAddress = environment.contracts.BRIDGE;
    }

    // Meter mint NFT
    async mintNft721(nftMetadata: NftMetadata, imageFile: File) {
        const fromAddress = await this.getAccount();

        // UPLOAD IPFS

        // image
        const imgCid = await this.upload([imageFile]);
        const imgUrl = `https://${imgCid}.ipfs.dweb.link/${imageFile.name}`;
        console.log('imgUrl', imgCid, imgUrl);

        // metadata
        nftMetadata.image = imgUrl;
        // nftMetadata.creator = fromAddress;
        const blob = new Blob([JSON.stringify(nftMetadata)], {
            type: 'application/json'
        });
        const metadataFile = new File([blob], 'metadata.json');
        const metadataCid = await this.upload([metadataFile]);
        const metadataUrl = `https://${metadataCid}.ipfs.dweb.link/${metadataFile.name}`;
        console.log('metadataUrl', metadataCid, metadataUrl);

        return this._httpClient.post(`${environment.apiUrl}/mint`, {
            minter: fromAddress,
            uri: metadataUrl,
            type: 'ERC721',
            count: 1
        });
    }

    getProvider() {
        return new ethers.providers.Web3Provider((window as any).ethereum);
        //return new ethers.providers.JsonRpcProvider('https://rpctest.meter.io')
    }

    getSigner() {
        const provider = this.getProvider();
        return provider.getSigner();
    }

    async getAccount() {
        const accounts = await this.getProvider().listAccounts();
        return accounts[0];
    }

    // Ethereum Nft 721 contract
    getNft721Contract(nftAddress: string) {
        return new Contract(nftAddress, NFT721.abi, this.getSigner());
    }

    // Ethereum Bridge contract
    getBridgeContract() {
        return new Contract(this._bridgeAddress, Bridge721.abi, this.getSigner());
    }

    // Ethereum approve nft
    async approve(nftAddress: string, nftTokenId: number) {
        // TODO: validate network

        const nftContract = this.getNft721Contract(nftAddress);
        const txApprove = await nftContract.approve(this._bridgeAddress, nftTokenId, {
            gasLimit: 1000000
        });

        console.log('txApprove', txApprove);
        // wait approve completed
        const receipt = await txApprove.wait(1);
        console.log('txApprove receipt', receipt);
    }

    // Meter burn nft
    async burn(receiverAddress: string, nftAddress: string, nftTokenId: number) {
        // TODO: validate network

        // 1. burn token
        const nftContract = this.getNft721Contract(nftAddress);
        const txBurn = await nftContract.burn(nftTokenId, { gasLimit: 1000000 });

        console.log('txBurn', txBurn);
        // wait completed
        const receipt = await txBurn.wait(1);
        console.log('txBurn receipt', receipt);

        // 2. submit withdraw token
        return this._httpClient.post(`${environment.apiUrl}/withdraw`, {
            receiverAddress: receiverAddress,
            tokenAddress: nftAddress,
            tokenId: nftTokenId,
            type: 'ERC721'
        });
    }

    // Ethereum deposit nft to bridge contract
    async deposit(nftAddress: string, nftTokenId: number, receiverAddress) {
        // TODO: validate network

        // 1. approve token
        const nftContract = this.getNft721Contract(nftAddress);
        const txApprove = await nftContract.approve(this._bridgeAddress, nftTokenId);
        console.log('approve token', txApprove);

        // 2. approve token
        const bridgeContract = this.getBridgeContract();
        const chainRounte = `${CHAIN_ID.EthereumTestnetRopsten}-${CHAIN_ID.MeterTestnet}`; // meter testnet chainid
        const nonce = 8888; // TODO: should be generated
        const txDeposit = await bridgeContract.deposit(nftAddress, nftTokenId, chainRounte, nonce, { gasLimit: 1000000 });
        console.log('deposit bridge', txDeposit);

        // wait completed
        const receipt = await txDeposit.wait(1);
        console.log('deposit bridge receipt', receipt);

        // // 3. submit
        return this._httpClient.post(`${environment.apiUrl}/deposit`, {
            receiverAddress: receiverAddress,
            tokenAddress: nftAddress,
            tokenId: nftTokenId,
            type: 'ERC721'
        });
    }

    private async upload(files: File[]): Promise<CIDString> {
        const rootCid = await this._storageClient.put(files);
        return rootCid;
    }
}
