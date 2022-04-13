// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

// import './node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
// import './node_modules/@openzeppelin/contracts/utils/Counters.sol';

contract PuppyNft721 is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721('Puppy Collection', 'PUPPY') {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, 'https://bafybeihyljtcw6c6ejuiymftjla2hfi3vjgojzdoui3kbiuzydivlzrx6u.ipfs.dweb.link/metadata.json');

        _tokenIds.increment();
        newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, 'https://bafybeih4rzld2pg6w2etnctvz3ekjza3jxod5o3dwcnfhwaqzgqefu7gve.ipfs.dweb.link/metadata.json');

        _tokenIds.increment();
        newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, 'https://bafybeid34siu4nfxt4yzu3nohax6yognvmvpzycm7nkb5fak3rfjn4abgy.ipfs.dweb.link/metadata.json');

        _tokenIds.increment();
        newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, 'https://bafybeielq7cc2u2gqvhxlvzdhv2f2k25cf6oa4sp2oorsdk5pf4auilguu.ipfs.dweb.link/metadata.json');

        _tokenIds.increment();
        newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, 'https://bafybeidny37nmqbsrdtm4em5jexpogbhkx6sem6izkes4qatguk2p6ggqa.ipfs.dweb.link/metadata.json');
    }
}
