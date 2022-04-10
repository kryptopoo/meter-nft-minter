// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

// import './node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
// import './node_modules/@openzeppelin/contracts/utils/Counters.sol';

contract AnimalLetterNft721 is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721('Animal Letter Collection', 'ALNFT') {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, 'https://bafybeiggiwrlcg7jae4xifccjtzt34tdxzopvud36lxdvs4sgb5kr5ov24.ipfs.dweb.link/metadata.json');

        _tokenIds.increment();
        newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, 'https://bafybeicn2d7unhvbnsrgzn2dvb6nnhl4awgwtckzdd2gjprcxoe33mvwh4.ipfs.dweb.link/metadata.json');

        _tokenIds.increment();
        newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, 'https://bafybeihfbsrdzrkntr2k426l2gdnl7b2jpzon6k7embjyp347gq7nqetje.ipfs.dweb.link/metadata.json');

        _tokenIds.increment();
        newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, 'https://bafybeicuylgrmmlqyoyew4j554cfaybheehrid53tkwjwivmek4qvpddjq.ipfs.dweb.link/metadata.json');

        _tokenIds.increment();
        newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, 'https://bafybeicaz5yot634qrgjeksrtlrizlwln4jrrwrz4khzivp3a7ffrvinvu.ipfs.dweb.link/metadata.json');

        _tokenIds.increment();
        newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, 'https://bafybeiheppify544uak43nhugzk247kovmskzg6hzurkxftc5abr7edml4.ipfs.dweb.link/metadata.json');
    }
}
