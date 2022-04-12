# Meter NFT Minter
Meter NFT Minter lets you create NFTs easily without code. It's also a trustless two-way transaction channel between Meter and Ethereum by the cross-chain bridge, users can transfer NFTs from other networks to Meter and vice versa.

### How does the Bridge work
1. Transfer token Ethereum => Meter

    <img src="https://user-images.githubusercontent.com/44108463/162940609-094c6d02-132b-4be3-8460-12db058f13c3.png" width="800" />



2. Transfer token Meter => Ethereum

    <img src="https://user-images.githubusercontent.com/44108463/162940606-3b86ed21-d3cf-4752-8d6a-43e9d93678da.png" width="800"/>


### Video Demo
[![Meter NFT Minter Demo](https://img.youtube.com/vi/wP500e8NWaw/0.jpg)](https://www.youtube.com/watch?v=wP500e8NWaw)

### Live Demo
https://meter-nft-minter-app.herokuapp.com


### Screenshots
<img src="https://user-images.githubusercontent.com/44108463/162737830-06e8192c-842e-48db-a7a9-2858b7aa97e4.PNG" width="800"/>
<img src="https://user-images.githubusercontent.com/44108463/162737839-0a0e8b15-8d2f-432d-8dba-1252f8320bf2.PNG" width="800"/>
<img src="https://user-images.githubusercontent.com/44108463/162737850-7a23918d-4d5d-494c-abf4-e4498e3c75f4.PNG" width="800"/>


## Deploy contracts
Deploy Ethereum NFT contract for mock test
```
node deploy-ethereum-nft.js
```

Deploy Bridge contract
```
node deploy-bridge.js <nft-contract>
```

Deploy NFT contract
```
node deploy-nft.js
```

## Configuration
- configure api: locate to `.env` and modify private key and contracts deployed above
- configure app: locate to `environment` and modify contracts deployed above

## Start development
- start api
```
cd api
node index.js
```

- start app
```
cd app
ng serve.js
```

## Testing

`Ethereum Testnet Animal Letter NFT` 0x90662d69E5F589e044B8aB5E5bD0e892ff0D76A7

`Ethereum Testnet Bridge` 0x620777774B01b66061a93210aa1251c658d5d2f0

`Meter Testnet NFT721` 0x7B61c90AB3E43f47596B62BA5EcB639Ec387c6c7
