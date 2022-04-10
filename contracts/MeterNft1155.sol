// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

// import '../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
// import '../node_modules/@openzeppelin/contracts/utils/Counters.sol';

contract MeterNft1155 is ERC1155 {
    mapping(uint256 => string) private _tokenURIs;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC1155('MeterNft1155_URI') {}

    function mint(
        address recipient,
        string memory tokenURI,
        uint256 amount
    ) public returns (uint256) {
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId, amount, '');
        _setTokenUri(newItemId, tokenURI);
        _tokenIds.increment();
        return newItemId;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return (_tokenURIs[tokenId]);
    }

    function _setTokenUri(uint256 tokenId, string memory tokenURI) private {
        _tokenURIs[tokenId] = tokenURI;
    }
}
