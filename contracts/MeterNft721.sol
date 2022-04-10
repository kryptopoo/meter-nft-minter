// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

// import './node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
// import './node_modules/@openzeppelin/contracts/utils/Counters.sol';
// import './node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';

contract MeterNft721 is ERC721URIStorage, IERC721Receiver {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    event NftReceived(address operator, address from, uint256 tokenId, bytes data);

    constructor() ERC721('Meterio NFT Minter', 'MTNFT') {}

    function mint(address recipient, string memory tokenURI) public returns (uint256) {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) public override returns (bytes4) {
        //success
        emit NftReceived(operator, from, tokenId, data);
        return bytes4(keccak256('onERC721Received(address,address,uint256,bytes)'));
    }
}
