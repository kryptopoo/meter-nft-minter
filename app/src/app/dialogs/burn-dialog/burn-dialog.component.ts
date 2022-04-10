import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    constructor(public dialogRef: MatDialogRef<BurnDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: BurnDialogData) {}

    ngOnInit(): void {}

    burn() {
        this.dialogRef.close(true);
    }
}
