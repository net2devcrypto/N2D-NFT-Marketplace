// SPDX-License-Identifier: MIT LICENSE

/*
N2D Marketplace NFT Resell Smart Contract
THIS CONTRACT IS AVAILABLE FOR EDUCATIONAL 
PURPOSES ONLY. YOU ARE SOLELY REPONSIBLE 
FOR ITS USE. I AM NOT RESPONSIBLE FOR ANY
OTHER USE. THIS IS TRAINING/EDUCATIONAL
MATERIAL. ONLY USE IT IF YOU AGREE TO THE
TERMS SPECIFIED ABOVE.

Revised v2

- Added Cancel Sale Function
- Fixed ItemId to TokenId Conflict Bug 
  using tokenId as location in Memory in Struct

*/



pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketResell is IERC721Receiver, ReentrancyGuard {

  address payable owner;
  uint256 listingFee = 0.0025 ether;

  struct List {
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => List) public vaultItems;

  event NFTListCreated (
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
      require(vaultItems[tokenId].tokenId == 0, "NFT already listed");
      require(price > 0, "Amount must be higher than 0");
      require(msg.value == listingFee, "Please transfer 0.0025 crypto to pay listing fee");
      vaultItems[tokenId] =  List(tokenId, payable(msg.sender), payable(address(this)), price, false);
      nft.transferFrom(msg.sender, address(this), tokenId);
      emit NFTListCreated(tokenId, msg.sender, address(this), price, false);
  }

  function buyNft(uint256 tokenId) public payable nonReentrant {
      uint256 price = vaultItems[tokenId].price;
      require(msg.value == price, "Transfer Total Amount to complete transaction");
      vaultItems[tokenId].seller.transfer(msg.value);
      payable(msg.sender).transfer(listingFee);
      nft.transferFrom(address(this), msg.sender, tokenId);
      vaultItems[tokenId].sold = true;
      delete vaultItems[tokenId];
  }

  function cancelSale(uint256 tokenId) public nonReentrant {
      require(vaultItems[tokenId].seller == msg.sender, "NFT not yours");
      nft.transferFrom(address(this), msg.sender, tokenId);
      delete vaultItems[tokenId];
  }
  
  function getPrice(uint256 tokenId) public view returns (uint256) {
      uint256 price = vaultItems[tokenId].price;
      return price;
  }

 function nftListings() public view returns (List[] memory) {
    uint256 nftCount = nft.totalSupply();
    uint currentIndex = 0;
    List[] memory items = new List[](nftCount);
    for (uint i = 0; i < nftCount; i++) {
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
