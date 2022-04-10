import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CHAIN_ID } from '../app.constants';
import { MintDialogComponent, MintDialogData } from '../dialogs/mint-dialog/mint-dialog.component';
import { ContractService, NftMetadata, NftAttribute } from '../services/contract.service';
import { WalletService } from '../services/wallet.service';

@Component({
    selector: 'app-minter',
    templateUrl: './minter.component.html',
    styleUrls: ['./minter.component.scss']
})
export class MinterComponent implements OnInit {
    mintDialogRef: MatDialogRef<MintDialogComponent>;

    panelOpenState = false;

    nftData: NftMetadata;
    imageFile: File;
    imageFileData: string = null;
    ercType: string = 'ERC721';

    isWalletConnected: boolean = false;

    constructor(private _walletService: WalletService, private _contractService: ContractService, private _dialog: MatDialog) {}

    async ngOnInit() {
        this.nftData = {
            name: '',
            description: '',
            image: '',
            attributes: new Array<NftAttribute>()
        };
        this._walletService.connection$.subscribe(async (connected) => {
            const network = await this._walletService.getNetwork((networkChanged) => {
                this.isWalletConnected = connected && networkChanged.chainId == CHAIN_ID.MeterTestnet;
            });
            this.isWalletConnected = connected && network.chainId == CHAIN_ID.MeterTestnet;
        });
    }

    async mint() {
        console.log(this.nftData, this.imageFile);
        (await this._contractService.mintNft721(this.nftData, this.imageFile)).subscribe((data: any) => {
            console.log('minted', data);

            this.mintDialogRef = this._dialog.open(MintDialogComponent, {
                data: {
                    tokenAddress: data.address,
                    tokenId: data.tokenId,
                    tx: data.tx
                },
                disableClose: true
            });
        });
    }

    addMetadata() {
        this.nftData.attributes.push({ trait_type: '', value: '' });
    }

    removeMetadata(i: number) {
        this.nftData.attributes = this.nftData.attributes.slice(0, i).concat(this.nftData.attributes.slice(i + 1, this.nftData.attributes.length));
    }

    selectErcType(ercType) {
        this.ercType = ercType;
    }

    readFileAsBuffer(file: File, callback: any) {
        const reader = new FileReader();
        reader.onload = function () {
            if (reader.result) {
                const buffer = Buffer.from(reader.result as ArrayBuffer);
                callback(buffer);
            } else {
                callback(null);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    readFileAsDataURL(blob: Blob, callback) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            callback(e.target.result);
        };
        reader.readAsDataURL(blob);
    }

    onUploadFileChanged(event: Event) {
        const target = event.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        this.imageFile = file;

        // preview image
        const reader = new FileReader();
        reader.onload = () => {
            this.imageFileData = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
}
