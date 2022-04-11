import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApproveDialogComponent, ApproveDialogData } from '../dialogs/approve-dialog/approve-dialog.component';
import { BurnDialogComponent } from '../dialogs/burn-dialog/burn-dialog.component';
import { ContractService } from '../services/contract.service';
import { ToastService } from '../services/toast.service';
import { WalletService } from '../services/wallet.service';

@Component({
    selector: 'app-bridge',
    templateUrl: './bridge.component.html',
    styleUrls: ['./bridge.component.scss']
})
export class BridgeComponent implements OnInit {
    approveDialogRef: MatDialogRef<ApproveDialogComponent>;
    burnDialogRef: MatDialogRef<BurnDialogComponent>;

    ercType: string = 'ERC721';
    ethToMtr: boolean = true;

    ethToMtrData = {
        tokenAddress: null,
        tokenId: null,
        receiverAddress: null
    };

    mtrToEthData = {
        tokenAddress: '',
        tokenId: ''
    };

    processing: boolean = false;

    constructor(
        private _contractService: ContractService,
        private _walletService: WalletService,
        private _dialog: MatDialog,
        private _toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.ethToMtrData.receiverAddress = this._walletService.getAddress();
    }

    async approve() {
        const nftAddress = this.ethToMtrData.tokenAddress;
        const nftId = this.ethToMtrData.tokenId;
        const receiverAddress = this.ethToMtrData.receiverAddress;

        this.approveDialogRef = this._dialog.open(ApproveDialogComponent, {
            data: {
                address: nftAddress,
                tokenId: nftId
            },
            disableClose: true
        });
        this.approveDialogRef.afterClosed().subscribe(async (approved) => {
            if (approved) {
                this.processing = true;
                (await this._contractService.deposit(nftAddress, Number(nftId), receiverAddress)).subscribe((data: any) => {
                    console.log('deposit res', data);
                    this._toastService
                        .success(`Transfer token successfully`, 'view')
                        .onAction()
                        .subscribe(() => {
                            window.open(`https://scan-warringstakes.meter.io/tx/${data.tx.transactionHash}`);
                        });
                    this.processing = false;
                });
            }
        });
    }

    async burn() {
        const nftAddress = this.mtrToEthData.tokenAddress;
        const nftId = Number(this.mtrToEthData.tokenId);
        const receiverAddress = this._walletService.getAddress();

        this.burnDialogRef = this._dialog.open(BurnDialogComponent, {
            data: {
                address: nftAddress,
                tokenId: nftId
            },
            disableClose: true
        });
        this.burnDialogRef.afterClosed().subscribe(async (burned) => {
            if (burned) {
                this.processing = true;
                (await this._contractService.burn(receiverAddress, nftAddress, nftId)).subscribe((data: any) => {
                    console.log('burn data', data);
                    this._toastService
                        .success(`Transfer token successfully`, 'view')
                        .onAction()
                        .subscribe(() => {
                            window.open(`https://ropsten.etherscan.io/tx/${data.tx.transactionHash}`);
                        });
                    this.processing = false;
                });
            }
        });
    }

    async changeNetwork(chainId){
        await this._walletService.changeNetwork(chainId)
    }
}
