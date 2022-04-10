import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WalletService } from '../services/wallet.service';
import { ToastService } from '../services/toast.service';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
    @ViewChild('walletDialogRef') walletDialogRef: TemplateRef<any>;
    @ViewChild('connectDialogRef') connectDialogRef: TemplateRef<any>;

    address: string = null;
    shortAddress: string = null;
    balance: string = null;
    network: string = null;

    constructor(private _toastService: ToastService, private _dialog: MatDialog, private _walletService: WalletService) {}

    ngOnInit(): void {}

    async connect() {
        await this._walletService.connect();

        this.address = this._walletService.getAddress();
        this.shortAddress = `${this.address.substring(0, 6)}...${this.address.substring(this.address.length - 4)}`;
        // this.balance = await this._walletService.getBalance();
        const network = await this._walletService.getNetwork((newNetwork) => {
            console.log(' network.name', newNetwork.name);
            this.network = newNetwork.name;
        });
        this.network = network.name;

        if (this.address) {
            this._toastService.success(`Connected wallet ${this.address}`, 'close');
        } else {
            this._toastService.error(`Cannot connect wallet`, 'close');
        }
    }

    async disconnect() {
        window.location.reload();
    }

    openWalletDialog() {
        this._dialog.open(this.walletDialogRef);
    }

    openConnectDialog() {
        this._dialog.open(this.connectDialogRef);
    }
}
