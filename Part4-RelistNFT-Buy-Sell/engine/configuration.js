/* 
       ___  ___    _  _  ___  _____   __  __             _         _   
 _ _  |_  )|   \  | \| || __||_   _| |  \/  | __ _  _ _ | |__ ___ | |_ 
| ' \  / / | |) | | .` || _|   | |   | |\/| |/ _` || '_|| / // -_)|  _|
|_||_|/___||___/  |_|\_||_|    |_|   |_|  |_|\__,_||_|  |_\_\\___| \__|
                                                                    
Update values accordingly
*/

/*
Private Key Encryption
Replace hhraw with your contract 
owner wallet private key "0xPRIVATEKEY"
*/

import SimpleCrypto from "simple-crypto-js"
const cipherKey = "#ffg3$dvcv4rtkljjkh38dfkhhjgt"
const hhraw = "0xREPLACEWITHPRIVATEKEY";
export const simpleCrypto = new SimpleCrypto(cipherKey)
export const cipherEth = simpleCrypto.encrypt(hhraw)
export const cipherHH = simpleCrypto.encrypt(hhraw)

/*
MARKET AND NFT CONTRACTS
*/
export var hhresell = "REPLACE WITH YOUR RESELL SMART CONTRACT";
export var hhnftcol = "REPLACE WITH YOUR NFT COLLECTION CONTRACT";

/*
NETWORK RPC ADDRESSES, Choose one then 
change the value of "hhrpc" below.
*/
var mumbai = 'https://matic-mumbai.chainstacklabs.com';
var goerli = 'https://rpc.ankr.com/eth_goerli';
var rinkeby = 'https://rpc.ankr.com/eth_rinkeby';

/*
CHANGE THIS TO YOUR PREFERRED TESTNET
*/
var hhrpc = goerli;
/*
Global Parameters
*/
export var mainnet = hhrpc

/*
DON'T FORGET TO SAVE!
*/