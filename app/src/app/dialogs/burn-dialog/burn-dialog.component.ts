import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ethers } from 'ethers';
import { ContractService } from 'src/app/services/contract.service';
import { WalletService } from 'src/app/services/wallet.service';

export interface BurnDialogData {
    address: string;
    tokenId: string;
    // metadata: any;
}

@Component({
    selector: 'app-burn-dialog',
    templateUrl: './burn-dialog.component.html',
    styleUrls: ['./burn-dialog.component.scss']
})
export class BurnDialogComponent implements OnInit {
    canBurn: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<BurnDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: BurnDialogData,
        private _contractService: ContractService,
        private _walletService: WalletService
    ) {}

    async ngOnInit() {
        const contract = this._contractService.getNft721Contract(this.data.address);
        console.log('contract', contract);
        const ownerAddress = await contract.ownerOf(Number(this.data.tokenId));
        console.log('ownerAddress', ethers.utils.getAddress(ownerAddress));
        this.canBurn = (ethers.utils.getAddress(ownerAddress)  == this._walletService.getAddress());
    }

    burn() {
        this.dialogRef.close(true);
    }
}
