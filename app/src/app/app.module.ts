import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MinterComponent } from './minter/minter.component';
import { AccountComponent } from './account/account.component';
import { BridgeComponent } from './bridge/bridge.component';

import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WalletComponent } from './wallet/wallet.component';
import { WalletService } from './services/wallet.service';
import { ContractService } from './services/contract.service';
import { ApproveDialogComponent } from './dialogs/approve-dialog/approve-dialog.component';
import { BurnDialogComponent } from './dialogs/burn-dialog/burn-dialog.component';
import { NftCardComponent } from './nft-card/nft-card.component';
import { MintDialogComponent } from './dialogs/mint-dialog/mint-dialog.component';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// function initializeAppFactory(httpClient: HttpClient): () => Observable<any> {
//     return () =>
//         httpClient.get(environment.apiUrl + '/config').subscribe(
//             (res) => {
//                 console.log('load config from node env', res);
//                 sessionStorage.setItem('MeterNftMinter.config', JSON.stringify(res));
//             },
//             (error) => {
//                 console.log('load config from angular env', environment);
//                 // sessionStorage.setItem('MeterNftMinter.config', JSON.stringify(environment));
//             }
//         );
// }

function initializeAppFactory(httpClient: HttpClient): () => Observable<any> {
    return () =>
        httpClient.get(environment.apiUrl + '/config').pipe(
            tap((res) => {
                console.log('load config from node env', res);
                sessionStorage.setItem('MeterNftMinter.config', JSON.stringify(res));
            })
        );
}

@NgModule({
    declarations: [
        AppComponent,
        MinterComponent,
        AccountComponent,
        BridgeComponent,
        WalletComponent,
        ApproveDialogComponent,
        BurnDialogComponent,
        NftCardComponent,
        MintDialogComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,

        MatButtonModule,
        MatListModule,
        MatSliderModule,
        MatIconModule,
        MatToolbarModule,
        MatCardModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatMenuModule,
        MatDialogModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatExpansionModule,

        BrowserAnimationsModule
    ],
    providers: [
        WalletService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeAppFactory,
            deps: [HttpClient],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
