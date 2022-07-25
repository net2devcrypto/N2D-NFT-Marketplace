// SPDX-License-Identifier: MIT LICENSE

/*
N2D Marketplace Sell Created NFT Smart Contract
THIS CONTRACT IS AVAILABLE FOR EDUCATIONAL 
PURPOSES ONLY. YOU ARE SOLELY REPONSIBLE 
FOR ITS USE. I AM NOT RESPONSIBLE FOR ANY
OTHER USE. THIS IS TRAINING/EDUCATIONAL
MATERIAL. ONLY USE IT IF YOU AGREE TO THE
TERMS SPECIFIED ABOVE.

Revision v2

- Added listing and minting fee balance 
  withdraw function.
*/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract n2DMarket is ReentrancyGuard, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;

  address payable holder;
  uint256 listingFee = 0.0025 ether;
  uint256 mintingFee = 0.0075 ether;

  constructor() {
    holder = payable(msg.sender);
  }

  struct VaultItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable holder;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => VaultItem) private idToVaultItem;

  event VaultItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address holder,
    uint256 price,
    bool sold
  );

  function getListingFee() public view returns (uint256) {
    return listingFee;
  }
  
  function createVaultItem(address nftContract,uint256 tokenId,uint256 price) public payable nonReentrant {
    require(price > 0, "Price cannot be zero");
    require(msg.value == listingFee, "Price cannot be listing fee");
    _itemIds.increment();
    uint256 itemId = _itemIds.current();
    idToVaultItem[itemId] =  VaultItem(itemId,nftContract,tokenId,payable(msg.sender),payable(address(0)),price,false);
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    emit VaultItemCreated(itemId,nftContract,tokenId,msg.sender,address(0),price,false);}

  function n2DMarketSale(
    address nftContract,uint256 itemId) public payable nonReentrant {
    uint price = idToVaultItem[itemId].price;
    uint tokenId = idToVaultItem[itemId].tokenId;
    require(msg.value == price, "Not enough balance to complete transaction");
    idToVaultItem[itemId].seller.transfer(msg.value);
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToVaultItem[itemId].holder = payable(msg.sender);
    idToVaultItem[itemId].sold = true;
    _itemsSold.increment();
    payable(holder).transfer(listingFee);
  }

  function getAvailableNft() public view returns (VaultItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    VaultItem[] memory items = new VaultItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToVaultItem[i + 1].holder == address(0)) {
        uint currentId = i + 1;
        VaultItem storage currentItem = idToVaultItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function getMyNft() public view returns (VaultItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToVaultItem[i + 1].holder == msg.sender) {
        itemCount += 1;
      }
    }

    VaultItem[] memory items = new VaultItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToVaultItem[i + 1].holder == msg.sender) {
        uint currentId = i + 1;
        VaultItem storage currentItem = idToVaultItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function getMyMarketNfts() public view returns (VaultItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToVaultItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    VaultItem[] memory items = new VaultItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToVaultItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        VaultItem storage currentItem = idToVaultItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function withdraw() public payable onlyOwner() {
    require(payable(msg.sender).send(address(this).balance));
    }
}
