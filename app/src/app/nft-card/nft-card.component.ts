import { Clipboard } from '@angular/cdk/clipboard';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ContractService } from '../services/contract.service';

@Component({
    selector: 'app-nft-card',
    templateUrl: './nft-card.component.html',
    styleUrls: ['./nft-card.component.scss']
})
export class NftCardComponent implements OnInit {
    @Input() address: string;
    @Input() tokenId: string;

    metadata: any;

    constructor(private _contractService: ContractService, private _httpClient: HttpClient, private _clipboard: Clipboard) {}

    async ngOnInit() {
        let contract = this._contractService.getNft721Contract(this.address);
        console.log('contract', contract);
        let tokenURI = await contract.tokenURI(Number(this.tokenId));
        console.log('tokenURI', tokenURI);
        this._httpClient.get(tokenURI).subscribe((metadata) => {
            console.log('metadata', metadata);
            setTimeout(() => {
                this.metadata = metadata;
            }, 500);
        });
    }

    shortAddress(address: string) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    copy(value){
        this._clipboard.copy(value);
    }
}
