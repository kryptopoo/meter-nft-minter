import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface MintDialogData {
    tokenAddress: string;
    tokenId: number;
    tx?: any;
}
@Component({
    selector: 'app-mint-dialog',
    templateUrl: './mint-dialog.component.html',
    styleUrls: ['./mint-dialog.component.scss']
})
export class MintDialogComponent implements OnInit {
    txUrl: string;
    constructor(private dialogRef: MatDialogRef<MintDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: MintDialogData) {
        this.txUrl = data.tx.transactionHash ? `https://scan-warringstakes.meter.io/tx/${data.tx.transactionHash}` : '';
    }

    ngOnInit(): void {}
}
