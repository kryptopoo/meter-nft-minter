import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    constructor(private _snackBar: MatSnackBar) {}

    success(message: string, action: string = null) {
        return this._snackBar.open(message, action, {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 10000,
            panelClass: ['snackbar-success']
        });
    }

    error(message: string, action: string = null) {
        this._snackBar.open(message, action, {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 5000,
            panelClass: ['snackbar-error']
        });
    }
}
