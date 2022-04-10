import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    constructor(public dialogRef: MatDialogRef<ApproveDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ApproveDialogData) {}

    ngOnInit(): void {}

    approve() {
        this.dialogRef.close(true);
    }
}
