import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CHAIN_ID, NETWORK } from '../app.constants';
import { ContractService } from '../services/contract.service';
import { WalletService } from '../services/wallet.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    nftItems = [];

    constructor(private _contractService: ContractService, private _walletService: WalletService, private _httpClient: HttpClient) {}

    async ngOnInit() {
        // TODO: validate correct wallet and network

        const network = await this._walletService.getNetwork((newNetwork) => {
            this.loadMyMintings(newNetwork.chainId);
        });

        this.loadMyMintings(network.chainId);
    }

    loadMyMintings(chainId) {
        if (chainId == CHAIN_ID.MeterTestnet) {
            this._walletService.getMyMintings().subscribe((data) => {
                console.log('data', data);

                (data as Array<any>).forEach(async (nft) => {
                    let contract = this._contractService.getNft721Contract(nft.nftAddress);
                    console.log('contract', contract);
                    let tokenURI = await contract.tokenURI(Number(nft.nftId));
                    console.log('tokenURI', tokenURI);

                    this.nftItems.push({ address: nft.nftAddress, tokenId: nft.nftId });
                });
            });
        }
    }
}
