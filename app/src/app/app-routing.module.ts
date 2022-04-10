import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { BridgeComponent } from './bridge/bridge.component';
import { MinterComponent } from './minter/minter.component';

const routes: Routes = [
  { path: '', component: MinterComponent },
  { path: 'bridge', component: BridgeComponent },
  { path: 'account', component: AccountComponent },
  { path: 'minter', component: MinterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
