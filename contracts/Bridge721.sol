// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

// import './node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';
// import './node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
// import './node_modules/@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract Bridge721 is ERC721Holder {
    event BridgeDeposited(address sender, address nftContract, uint256 tokenId, string chainRoute);
    event BridgeWithdrawn(address receiver, address nftContract, uint256 tokenId, string chainRoute);

    address public validator;
    mapping(bytes32 => bool) public deposited;
    mapping(bytes32 => bool) public withdrew;

    constructor(address _validator) {
        require(_validator != address(0), 'Invalid validator address');

        validator = _validator;
    }

    function deposit(
        address nftContract,
        uint256 tokenId,
        string memory chainRoute,
        uint256 nonce
    ) public {
        bytes32 hash = hashMessage(msg.sender, nftContract, tokenId, chainRoute, nonce);

        require(!deposited[hash], 'Duplicate hash');
        deposited[hash] = true;

        ERC721 _nftContract = ERC721(nftContract);
        _nftContract.transferFrom(msg.sender, address(this), tokenId);

        emit BridgeDeposited(msg.sender, nftContract, tokenId, chainRoute);
    }

    function withdraw(
        address receiver,
        address nftContract,
        uint256 tokenId,
        string memory chainRoute,
        uint256 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        bytes32 hash = hashMessage(receiver, nftContract, tokenId, chainRoute, nonce);

        address signer = ECDSA.recover(ECDSA.toEthSignedMessageHash(hash), v, r, s);
        require(signer == validator, 'Invalid validator signature.');

        // address signer = ecrecover(hash, v, r, s);
        // require(signer == validator, 'Invalid validator signature');

        require(deposited[hash] == true, 'Invalid receiver');

        require(!withdrew[hash], 'Already withdrawn');
        withdrew[hash] = true;

        ERC721 _nftContract = ERC721(nftContract);
        _nftContract.safeTransferFrom(address(this), receiver, tokenId);

        emit BridgeWithdrawn(receiver, nftContract, tokenId, chainRoute);
    }

    function hashMessage(
        address owner,
        address nftContract,
        uint256 tokenId,
        string memory chainRoute,
        uint256 nonce
    ) public pure returns (bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(owner, nftContract, tokenId, chainRoute, nonce));
        return hash;
    }
}
