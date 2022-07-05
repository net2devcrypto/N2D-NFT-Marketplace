<a href="http://youtube.a3b.io" target="_blank"><img src="https://github.com/net2devcrypto/N2D-NFT-Marketplace/blob/main/n2DMarket.png" width="260" height="50"></a>

🚀👩‍🚀This repo contains all the files to follow along and implement a MultiChain NFT MarketPlace! Be sure to watch my Youtube tutorials so you can learn and follow along!

** THE FILES ATTACHED TO THIS REPO ARE FOR EDUCATIONAL PURPOSES ONLY **

** NOT FINANCIAL ADVISE **

** USE IT AT YOUR OWN RISK** **I'M NOT RESPONSIBLE FOR ANY USE, ISSUES ETC.. **

Please follow instructions for the video tutorial you are watching.

Video tutorial playlist:

https://www.youtube.com/watch?v=RnPMP813KMc&list=PLLkrq2VBYc1a2taQxryxo_sfHIOe6TeJP

################################################################

Part-1 Hardhat and EthersJS

Steps:

1-Create an new NextJS app:

npx create-next-app n2dmarket

2- Install hardhat in the n2dmarket project folder.

npm i hardhat

3- Create a hardhat environment (Follow Video Tutorial)

npx hardhat

4- Refer to the Hardhat and EthersJS knowledge base and 
practice some info gathering using the hardhat console:

npx hardhat console

Hardhat Knowledge Base : https://hardhat.org/tutorial

EthersJS Knowledge Base: https://docs.ethers.io/v5/

#######################################################


Part-2 NFT Market Resell Smart Contract

How to practice

1-Retrieve the NFT Collection Smart Contract Address.

2- Deploy the NFT Market Resell Smart Contract located in Part2 Folder.

Add the NFT Collection Address when deploying the smart contract.

Follow Part 2 Vid for explanation and procedures.

#######################################################

Part-3 Deploy a NextJS WebFront End

Steps:

1- Navigate to your n2dmarket project folder and install the

remaining dependencies:

npm i --save-dev "@types/react"

npm i axios @nextui-org/react sf-font

npm i simple-crypto-js web3modal

npm i @metamask/detect-provider

npm i ipfs-http-client

npm i web3

npm i --save-dev @types/canvas-confetti


2- Proceed to replace the files in your n2dmarket folder with each respective

file attached in the Part-3 Folder, Add the "engine" folder to the project root folder.

3- Deploy your test NFT Collection and NFT Market Resell Smart Contracts (refer to Part2 Vid)

and go to /engine/configuration and update the values accordingly:

export var hhresell = "YOUR NFT RESELL MARKET SMART CONTRACT";

export var hhnftcol = "YOUR NFT COLLECTION SMART CONTRACT";

var hhrpc = "YOUR MAINNET OR TESTNET RPC ADDRESS";

List of RPC Address to use depending on which testnet the contracts have been deployed:

Polygon Mumbai: https://matic-mumbai.chainstacklabs.com

BSC Testnet: https://data-seed-prebsc-1-s3.binance.org:8545

ETH Goerli: https://rpc.ankr.com/eth_goerli

CTRL + S to save configs

Run the web server and validate:

npm run dev

Watch part 3 vid for more details.

#######################################################
