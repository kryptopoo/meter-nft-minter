import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NETWORK } from './../app.constants';
import { ethers } from 'ethers';

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    connection$: Subject<boolean> = new Subject<boolean>();
    private _address: string = null;

    constructor(private _httpClient: HttpClient) {
        // this.web3 = new Web3((window as any).ethereum);
    }

    async connect(): Promise<boolean> {
        const ethereum = (window as any)?.ethereum;

        if (!ethereum?.isMetaMask) return null;
        await ethereum.enable();

        try {
            // Will open the MetaMask UI
            // You should disable this button while the request is pending!
            await ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length > 0) {
                this._address = ethers.utils.getAddress(accounts[0]);
                this.connection$.next(true);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
        }

        return false;
    }

    async disconnect() {
        this._address = null;
        window.location.reload();
    }

    getAddress() {
        return this._address;
    }

    async getBalance() {
        const balance = await this.getProvider().getBalance('address');
        // console.log('wei', wei);
        // const balance = this.web3.utils.fromWei(wei, 'ether');
        // console.log('balance', ethers.utils.formatUnits(balance, 18));
        console.log('balance', ethers.utils.formatEther(balance));
        return ethers.utils.formatEther(balance);
    }

    getProvider() {
        return new ethers.providers.Web3Provider((window as any).ethereum);
    }

    async getNetwork(onNetworkChanged) {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum, 'any');
        var network = await provider.getNetwork();
        console.log(network);

        provider.on('network', (newNetwork, oldNetwork) => {
            console.log('oldNetwork', oldNetwork);
            console.log('newNetwork', newNetwork);

            if (!newNetwork.name || newNetwork.name == 'unknown') {
                newNetwork.name = NETWORK[newNetwork.chainId];
            }
            onNetworkChanged(newNetwork);
        });

        if (!network.name || network.name == 'unknown') {
            network.name = NETWORK[network.chainId];
        }

        return network;
    }

    async changeNetwork(chainId) {
        console.log(ethers.utils.hexlify(chainId));
        if ((window as any).ethereum) {
            try {
                await (window as any).ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexlify(chainId) }]
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

    getMyMintings() {
        return this._httpClient.post(`${environment.apiUrl}/account`, {
            address: this._address
        });
    }
}
