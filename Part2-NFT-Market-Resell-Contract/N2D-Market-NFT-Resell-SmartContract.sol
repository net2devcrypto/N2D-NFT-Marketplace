// SPDX-License-Identifier: MIT LICENSE

/*
N2D Marketplace NFT Resell Smart Contract
THIS CONTRACT IS AVAILABLE FOR EDUCATIONAL 
PURPOSES ONLY. YOU ARE SOLELY REPONSIBLE 
FOR ITS USE. I AM NOT RESPONSIBLE FOR ANY
OTHER USE. THIS IS TRAINING/EDUCATIONAL
MATERIAL. ONLY USE IT IF YOU AGREE TO THE
TERMS SPECIFIED ABOVE.
*/


pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketResell is IERC721Receiver, ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;

  address payable owner;
  uint256 listingFee = 0.0025 ether;

  struct List {
    uint itemId;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => List) public vaultItems;

  event NFTListCreated (
    uint indexed itemId,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  function getListingFee() public view returns (uint256) {
    return listingFee;
  }

  ERC721Enumerable nft;

   constructor(ERC721Enumerable _nft) {
    owner = payable(msg.sender);
    nft = _nft;
  }

  function listSale(uint256 tokenId, uint256 price) public payable nonReentrant {
      require(nft.ownerOf(tokenId) == msg.sender, "NFT not yours");
      require(vaultItems[tokenId].tokenId == 0, 'already listed');
      require(price > 0, "Amount must be higher than 0");
      require(msg.value == listingFee, "Please transfer 0.0025 crypto to pay listing fee");
      _itemIds.increment();
      uint256 itemId = _itemIds.current();
      vaultItems[itemId] =  List(itemId, tokenId, payable(msg.sender), payable(address(this)), price, false);
      nft.transferFrom(msg.sender, address(this), tokenId);
      emit NFTListCreated(itemId, tokenId, msg.sender, address(this), price, false);
  }

    function buyNft(uint256 itemId) public payable nonReentrant {
      uint256 price = vaultItems[itemId].price;
      uint256 tokenId = vaultItems[itemId].tokenId;
      require(msg.value == price, "Transfer Total Amount to complete transaction");
      vaultItems[itemId].seller.transfer(msg.value);
      payable(msg.sender).transfer(listingFee);
      nft.transferFrom(address(this), msg.sender, tokenId);
      vaultItems[itemId].sold = true;
      _itemsSold.increment();
      delete vaultItems[tokenId];
      delete vaultItems[itemId];
  }

 function nftListings() public view returns (List[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;
    List[] memory items = new List[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
        if (vaultItems[i + 1].owner == address(this)) {
        uint currentId = i + 1;
        List storage currentItem = vaultItems[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
      require(from == address(0x0), "Cannot send nfts to Vault directly");
      return IERC721Receiver.onERC721Received.selector;
    }
  
}