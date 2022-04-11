import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ethers } from 'ethers';
import { ContractService } from 'src/app/services/contract.service';
import { WalletService } from 'src/app/services/wallet.service';

export interface ApproveDialogData {
    address: string;
    tokenId: string;
    // metadata: any;
}

@Component({
    selector: 'app-approve-dialog',
    templateUrl: './approve-dialog.component.html',
    styleUrls: ['./approve-dialog.component.scss']
})
export class ApproveDialogComponent implements OnInit {
    canApprove: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<ApproveDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ApproveDialogData,
        private _contractService: ContractService,
        private _walletService: WalletService
    ) {}

    async ngOnInit() {
        const contract = this._contractService.getNft721Contract(this.data.address);
        console.log('contract', contract);
        const ownerAddress = await contract.ownerOf(Number(this.data.tokenId));
        console.log('ownerAddress', ethers.utils.getAddress(ownerAddress));
        this.canApprove =  this._walletService.getAddress() != null &&  (ethers.utils.getAddress(ownerAddress) == this._walletService.getAddress());
    }

    approve() {
        this.dialogRef.close(true);
    }
}
