import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from "web3modal";
import { useRouter } from 'next/router';
import NFTCollection from '../engine/NFTCollection.json'
import Resell from '../engine/Resell.json';
import Market from '../engine/Market.json';
import NFT from '../engine/NFT.json';
import { Grid, Card, Text, Button, Row, Spacer, Container } from '@nextui-org/react';
import { hhnft, hhmarket, hhresell, hhnftcol, hhrpc } from '../engine/configuration';
import { goenft, goemarket, goeresell, goenftcol, goerpc } from '../engine/configuration';
import { bsctnft, bsctmarket, bsctresell, bsctnftcol, bsctrpc } from '../engine/configuration';
import { mmnft, mmmarket, mmresell, mmnftcol, mmrpc } from '../engine/configuration';
import { cipherHH, cipherEth, simpleCrypto } from '../engine/configuration';
import confetti from 'canvas-confetti';
import 'sf-font';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function Home() {
  const [hhlist, hhResellNfts] = useState([])
  const [hhnfts, hhsetNfts] = useState([])
  const [goelist, goeResellNfts] = useState([])
  const [goenfts, goesetNfts] = useState([])
  const [bsctlist, bsctResellNfts] = useState([])
  const [bsctnfts, bsctsetNfts] = useState([])
  const [mmlist, MumResellNfts] = useState([])
  const [mmnfts, MumsetNfts] = useState([])

  useEffect(() => {
    loadHardHatResell()
    loadGoerliResell()
    loadBsctResell()
  }, [hhResellNfts, hhsetNfts, goeResellNfts, 
    goesetNfts, bsctResellNfts, bsctsetNfts])

  const handleConfetti = () => {
    confetti();
  };
  const router = useRouter()

  /*
  Hardhat Listings Functions
  */

  async function loadHardHatResell() {
    const provider = new ethers.providers.JsonRpcProvider(hhrpc)
    const key = simpleCrypto.decrypt(cipherHH)
    const wallet = new ethers.Wallet(key, provider);
    const contract = new ethers.Contract(hhnftcol, NFTCollection, wallet);
    const market = new ethers.Contract(hhresell, Resell, wallet);
    const itemArray = [];
    contract.totalSupply().then(result => {
      for (let i = 0; i < result; i++) {
        var token = i + 1         
        var owner = contract.ownerOf(token)
        var getOwner = Promise.resolve(owner)
        getOwner.then(address => {
        if (address == hhresell) {
        const rawUri = contract.tokenURI(token)
        const Uri = Promise.resolve(rawUri)
        const getUri = Uri.then(value => {
          let str = value
          let cleanUri = str.replace('ipfs://', 'https://ipfs.io/ipfs/')
          console.log(cleanUri)
          let metadata = axios.get(cleanUri).catch(function (error) {
            console.log(error.toJSON());
          });
          return metadata;
        })
        getUri.then(value => {
          let rawImg = value.data.image
          var name = value.data.name
          var desc = value.data.description
          let image = rawImg.replace('ipfs://', 'https://ipfs.io/ipfs/')
          const price = market.getPrice(token)
          Promise.resolve(price).then(_hex => {
          var salePrice = Number(_hex);
          var txPrice = salePrice.toString()
          Promise.resolve(owner).then(value => {
            let ownerW = value;
            let outPrice = ethers.utils.formatUnits(salePrice.toString(), 'ether')
            let meta = {
              name: name,
              img: image,
              cost: txPrice,
              val: outPrice,
              tokenId: token,
              wallet: ownerW,
              desc
            }
            console.log(meta)
            itemArray.push(meta)
          })
        })
      })
    }})
    }})
    await new Promise(r => setTimeout(r, 3000));
    hhResellNfts(itemArray)
    loadHHSaleNFTs();
  }
  async function loadHHSaleNFTs() {
    const hhPrivkey = simpleCrypto.decrypt(cipherHH)
    const provider = new ethers.providers.JsonRpcProvider(hhrpc)
    const wallet = new ethers.Wallet(hhPrivkey, provider);
    const tokenContract = new ethers.Contract(hhnft, NFT, wallet)
    const marketContract = new ethers.Contract(hhmarket, Market, wallet)
    const data = await marketContract.getAvailableNft()
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    hhsetNfts(items)
  }

    async function buyNewHH(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(hhmarket, Market, signer)
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.n2DMarketSale(hhnft, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadHHSaleNFTs();
  }

  /*
  Goerli Listings Functions
  */

  async function loadGoerliResell() {
    const provider = new ethers.providers.JsonRpcProvider(goerpc)
    const key = simpleCrypto.decrypt(cipherEth)
    const wallet = new ethers.Wallet(key, provider);
    const contract = new ethers.Contract(goenftcol, NFTCollection, wallet);
    const market = new ethers.Contract(goeresell, Resell, wallet);
    const itemArray = [];
    contract.totalSupply().then(result => {
      for (let i = 0; i < result; i++) {
        var token = i + 1         
        var owner = contract.ownerOf(token)
        var getOwner = Promise.resolve(owner)
        getOwner.then(address => {
        if (address == goeresell) {
        const rawUri = contract.tokenURI(token)
        const Uri = Promise.resolve(rawUri)
        const getUri = Uri.then(value => {
          let str = value
          let cleanUri = str.replace('ipfs://', 'https://ipfs.io/ipfs/')
          console.log(cleanUri)
          let metadata = axios.get(cleanUri).catch(function (error) {
            console.log(error.toJSON());
          });
          return metadata;
        })
        getUri.then(value => {
          let rawImg = value.data.image
          var name = value.data.name
          var desc = value.data.description
          let image = rawImg.replace('ipfs://', 'https://ipfs.io/ipfs/')
          const price = market.getPrice(token)
          Promise.resolve(price).then(_hex => {
          var salePrice = Number(_hex);
          var txPrice = salePrice.toString()
          Promise.resolve(owner).then(value => {
            let ownerW = value;
            let outPrice = ethers.utils.formatUnits(salePrice.toString(), 'ether')
            let meta = {
              name: name,
              img: image,
              cost: txPrice,
              val: outPrice,
              tokenId: token,
              wallet: ownerW,
              desc
            }
            console.log(meta)
            itemArray.push(meta)
          })
        })
      })
    }})
    }})
    await new Promise(r => setTimeout(r, 3000));
    goeResellNfts(itemArray)
    loadGoeSaleNFTs();
  }

  async function loadGoeSaleNFTs() {
    const hhPrivkey = simpleCrypto.decrypt(cipherEth)
    const provider = new ethers.providers.JsonRpcProvider(goerpc)
    const wallet = new ethers.Wallet(hhPrivkey, provider);
    const tokenContract = new ethers.Contract(goenft, NFT, wallet)
    const marketContract = new ethers.Contract(goemarket, Market, wallet)
    const data = await marketContract.getAvailableNft()
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    goesetNfts(items)
  }

  async function buyNewGoe(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(goemarket, Market, signer)
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.n2DMarketSale(goenft, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadGoeSaleNFTs()
  }

   /*
  BSCT Listings Functions
  */

  async function loadBsctResell() {
    const provider = new ethers.providers.JsonRpcProvider(bsctrpc)
    const key = simpleCrypto.decrypt(cipherEth)
    const wallet = new ethers.Wallet(key, provider);
    const contract = new ethers.Contract(bsctnftcol, NFTCollection, wallet);
    const market = new ethers.Contract(bsctresell, Resell, wallet);
    const itemArray = [];
    contract.totalSupply().then(result => {
      for (let i = 0; i < result; i++) {
        var token = i + 1         
        var owner = contract.ownerOf(token)
        var getOwner = Promise.resolve(owner)
        getOwner.then(address => {
        if (address == bsctresell) {
        const rawUri = contract.tokenURI(token)
        const Uri = Promise.resolve(rawUri)
        const getUri = Uri.then(value => {
          let str = value
          let cleanUri = str.replace('ipfs://', 'https://ipfs.io/ipfs/')
          console.log(cleanUri)
          let metadata = axios.get(cleanUri).catch(function (error) {
            console.log(error.toJSON());
          });
          return metadata;
        })
        getUri.then(value => {
          let rawImg = value.data.image
          var name = value.data.name
          var desc = value.data.description
          let image = rawImg.replace('ipfs://', 'https://ipfs.io/ipfs/')
          const price = market.getPrice(token)
          Promise.resolve(price).then(_hex => {
          var salePrice = Number(_hex);
          var txPrice = salePrice.toString()
          Promise.resolve(owner).then(value => {
            let ownerW = value;
            let outPrice = ethers.utils.formatUnits(salePrice.toString(), 'ether')
            let meta = {
              name: name,
              img: image,
              cost: txPrice,
              val: outPrice,
              tokenId: token,
              wallet: ownerW,
              desc
            }
            console.log(meta)
            itemArray.push(meta)
          })
        })
      })
    }})
    }})
    await new Promise(r => setTimeout(r, 3000));
    bsctResellNfts(itemArray)
    loadBsctSaleNFTs();
  }

  async function loadBsctSaleNFTs() {
    const hhPrivkey = simpleCrypto.decrypt(cipherEth)
    const provider = new ethers.providers.JsonRpcProvider(bsctrpc)
    const wallet = new ethers.Wallet(hhPrivkey, provider);
    const tokenContract = new ethers.Contract(bsctnft, NFT, wallet)
    const marketContract = new ethers.Contract(bsctmarket, Market, wallet)
    const data = await marketContract.getAvailableNft()
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    bsctsetNfts(items)
  }

  async function buyNewBsct(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(bsctmarket, Market, signer)
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.n2DMarketSale(bsctnft, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadBsctSaleNFTs()
  }

  /*
  Mumbai Listings Functions
  */

  async function loadMumResell() {
    const provider = new ethers.providers.JsonRpcProvider(mmrpc)
    const key = simpleCrypto.decrypt(cipherEth)
    const wallet = new ethers.Wallet(key, provider);
    const contract = new ethers.Contract(mmnftcol, NFTCollection, wallet);
    const market = new ethers.Contract(mmresell, Resell, wallet);
    const itemArray = [];
    contract.totalSupply().then(result => {
      for (let i = 0; i < result; i++) {
        var token = i + 1         
        var owner = contract.ownerOf(token)
        var getOwner = Promise.resolve(owner)
        getOwner.then(address => {
        if (address == mmresell) {
        const rawUri = contract.tokenURI(token)
        const Uri = Promise.resolve(rawUri)
        const getUri = Uri.then(value => {
          let str = value
          let cleanUri = str.replace('ipfs://', 'https://ipfs.io/ipfs/')
          console.log(cleanUri)
          let metadata = axios.get(cleanUri).catch(function (error) {
            console.log(error.toJSON());
          });
          return metadata;
        })
        getUri.then(value => {
          let rawImg = value.data.image
          var name = value.data.name
          var desc = value.data.description
          let image = rawImg.replace('ipfs://', 'https://ipfs.io/ipfs/')
          const price = market.getPrice(token)
          Promise.resolve(price).then(_hex => {
          var salePrice = Number(_hex);
          var txPrice = salePrice.toString()
          Promise.resolve(owner).then(value => {
            let ownerW = value;
            let outPrice = ethers.utils.formatUnits(salePrice.toString(), 'ether')
            let meta = {
              name: name,
              img: image,
              cost: txPrice,
              val: outPrice,
              tokenId: token,
              wallet: ownerW,
              desc
            }
            console.log(meta)
            itemArray.push(meta)
          })
        })
      })
    }})
    }})
    await new Promise(r => setTimeout(r, 3000));
    MumResellNfts(itemArray)
    loadMumSaleNFTs();
  }

  async function loadMumSaleNFTs() {
    const hhPrivkey = simpleCrypto.decrypt(cipherEth)
    const provider = new ethers.providers.JsonRpcProvider(bsctrpc)
    const wallet = new ethers.Wallet(hhPrivkey, provider);
    const tokenContract = new ethers.Contract(mmnft, NFT, wallet)
    const marketContract = new ethers.Contract(mmmarket, Market, wallet)
    const data = await marketContract.getAvailableNft()
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    MumsetNfts(items)
  }

  async function buyNewMum(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(mmmarket, Market, signer)
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.n2DMarketSale(mmnft, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadMumSaleNFTs()
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1 
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 
    }
  };

  return (
    <div>
      <div>
        <Container xl style={{ backgroundImage: 'linear-gradient(to top, #020202, #050505, #080808, #0b0b0b, #0e0e0e, #16141a, #1e1724, #291a2d, #451a3a, #64133c, #820334, #9b0022)' }}>
          <Container xs css={{marginBottom:'$3'}}>
          <Text css={{ marginLeft: '$40', justifyContent:'' }} h2>Top Collections</Text>
          <Carousel swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={6000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={800}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-100-px">
            {
              hhlist.map((nft, i) => (
                  <div>
                    <Card.Image css={{marginLeft:'$15', maxWidth:'450px'}} src={nft.img} key={i} />
                  </div>
              ))
            }
          </Carousel>
          </Container>
        </Container>
      </div>
      <Container sm>
        <Row css={{ marginTop: '$3', marginBottom: '$3' }}>
          <Text h3>Latest Relisted NFT's on HardHat</Text>
        </Row>
        <Grid.Container gap={1} justify="flex-start">
          {
            hhlist.slice(0, 9).map((nft, id) => {
                async function buylistNft() {
                  const web3Modal = new Web3Modal()
                  const connection = await web3Modal.connect()
                  const provider = new ethers.providers.Web3Provider(connection)
                  const signer = provider.getSigner()
                  const contract = new ethers.Contract(hhresell, Resell, signer)
                  const transaction = await contract.buyNft(nft.tokenId, { value: nft.cost })
                  await transaction.wait()
                  router.push('/portal')
                }
                return (
                  <Grid xs={3}>
                    <Card style={{ boxShadow: '1px 1px 10px #ffffff' }} variant="bordered" key={id}>
                      <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontFamily: 'SF Pro Display',
                        fontWeight: '200',
                        fontSize: '20px',
                        marginLeft: '3px'
                      }}>{nft.name} Token-{nft.tokenId}</Text>
                      <Card.Body css={{ p: 0 }}>
                        <Card.Image 
                          style={{ maxWidth: '150px', borderRadius: '6%' }}
                          src={nft.img}
                        />
                      </Card.Body>
                      <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row key={id}wrap="wrap" justify="space-between" align="center">
                      <Text wrap="wrap">{nft.desc}</Text>
                      <Text  style={{ fontSize: '30px' }}>{nft.val} <img src='n2dr-logo.png' style={{ width: '60px', height: '25px', marginTop: '4px' }} /></Text>
                      <Button color="gradient" style={{ fontSize: '20px' }} onPress={() => handleConfetti(buylistNft(nft))}>Buy</Button>
                    </Row>
                  </Card.Footer>
                </Card>
                  </Grid>
                )
              })
            }
        </Grid.Container>
      </Container>
      <Spacer></Spacer>
      <Container sm>
        <Row css={{ marginTop: '$3', marginBottom: '$3' }}>
          <Text h3>Available NFT's on HardHat</Text>
        </Row>
        <Grid.Container gap={1} justify="flex-start">
          {
            hhnfts.slice(0, 4).map((nft, i) => (
              <Grid xs={3}>
                <Card style={{ marginRight: '3px', boxShadow: '1px 1px 10px #ffffff' }} variant="bordered" key={i}>
                  <Text style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'SF Pro Display',
                    fontWeight: '200',
                    fontSize: '20px',
                    marginLeft: '3px'
                  }}>{nft.name}</Text>
                  <Card.Body css={{ p: 0}}>
                    <Card.Image
                      style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '6%' }}
                      src={nft.image}
                    />
                  </Card.Body>
                  <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row wrap="wrap" justify="space-between" align="center">
                      <Text wrap="wrap">{nft.description}</Text>
                      <Text style={{ fontSize: '30px' }}>{nft.price}<img src='n2dr-logo.png' style={{ width: '60px', height: '25px', marginTop: '4px' }} /></Text>
                      <Button color="gradient" style={{ fontSize: '20px' }} onClick={() => handleConfetti(buyNewHH(nft))}>Buy</Button>
                    </Row>
                  </Card.Footer>
                </Card>
              </Grid>
            ))
          }
        </Grid.Container>
        </Container>
        <Container sm>
        <Row css={{ marginTop: '$3', marginBottom: '$3' }}>
          <Text h3>Latest Relisted NFT's on </Text><img src='ethereumlogo.png' style={{ width: '190px', height: '45px', marginLeft: '4px' }} />
        </Row>
        <Grid.Container gap={1} justify="flex-start">
          {
            goelist.slice(0, 9).map((nft, id) => {
                async function buylistNft() {
                  const web3Modal = new Web3Modal()
                  const connection = await web3Modal.connect()
                  const provider = new ethers.providers.Web3Provider(connection)
                  const signer = provider.getSigner()
                  const contract = new ethers.Contract(goeresell, Resell, signer)
                  const transaction = await contract.buyNft(nft.tokenId, { value: nft.cost })
                  await transaction.wait()
                  router.push('/portal')
                }
                return (
                  <Grid xs={3}>
                    <Card style={{ boxShadow: '1px 1px 10px #ffffff' }} variant="bordered" key={id}>
                      <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontFamily: 'SF Pro Display',
                        fontWeight: '200',
                        fontSize: '20px',
                        marginLeft: '3px'
                      }}>{nft.name} Token-{nft.tokenId}</Text>
                      <Card.Body css={{ p: 0 }}>
                        <Card.Image 
                          style={{ maxWidth: '150px', borderRadius: '6%' }}
                          src={nft.img}
                        />
                      </Card.Body>
                      <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row key={id}wrap="wrap" justify="space-between" align="center">
                      <Text wrap="wrap">{nft.desc}</Text>
                      <Text  style={{ fontSize: '30px' }}>{nft.val} <img src='n2dr-logo.png' style={{ width: '60px', height: '25px', marginTop: '4px' }} /></Text>
                      <Button color="gradient" style={{ fontSize: '20px' }} onPress={() => handleConfetti(buylistNft(nft))}>Buy</Button>
                    </Row>
                  </Card.Footer>
                </Card>
                  </Grid>
                )
              })
            }
        </Grid.Container>
      </Container>
        <Spacer></Spacer>
      <Container sm>
        <Row css={{ marginTop: '$3', marginBottom: '$3' }}>
          <Text h3>Latest NFT's on</Text><img src='ethereumlogo.png' style={{ width: '190px', height: '45px', marginLeft: '4px' }} />
        </Row>
        <Grid.Container gap={1} justify="flex-start">
          {
            goenfts.slice(0, 4).map((nft, i) => (
              <Grid xs={3}>
                <Card style={{ marginRight: '3px', boxShadow: '1px 1px 10px #ffffff' }} variant="bordered" key={i}>
                  <Text style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'SF Pro Display',
                    fontWeight: '200',
                    fontSize: '20px',
                    marginLeft: '3px'
                  }}>{nft.name}</Text>
                  <Card.Body css={{ p: 0}}>
                    <Card.Image
                      style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '6%' }}
                      src={nft.image}
                    />
                  </Card.Body>
                  <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row wrap="wrap" justify="space-between" align="center">
                      <Text wrap="wrap">{nft.description}</Text>
                      <Text style={{ fontSize: '30px' }}>{nft.price}<img src='n2dr-logo.png' style={{ width: '60px', height: '25px', marginTop: '4px' }} /></Text>
                      <Button color="gradient" style={{ fontSize: '20px' }} onClick={() => handleConfetti(buyNewGoe(nft))}>Buy</Button>
                    </Row>
                  </Card.Footer>
                </Card>
              </Grid>
            ))
          }
        </Grid.Container>
        </Container>
        <Container sm>
        <Row css={{ marginTop: '$3', marginBottom: '$3' }}>
          <Text h3>Latest Relisted NFT's on </Text><img src='bsc.png' style={{ width: '190px', height: '45px', marginLeft: '4px' }} />
        </Row>
        <Grid.Container gap={1} justify="flex-start">
          {
            bsctlist.slice(0, 9).map((nft, id) => {
                async function buylistNft() {
                  const web3Modal = new Web3Modal()
                  const connection = await web3Modal.connect()
                  const provider = new ethers.providers.Web3Provider(connection)
                  const signer = provider.getSigner()
                  const contract = new ethers.Contract(bsctresell, Resell, signer)
                  const transaction = await contract.buyNft(nft.tokenId, { value: nft.cost })
                  await transaction.wait()
                  router.push('/portal')
                }
                return (
                  <Grid xs={3}>
                    <Card style={{ boxShadow: '1px 1px 10px #ffffff' }} variant="bordered" key={id}>
                      <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontFamily: 'SF Pro Display',
                        fontWeight: '200',
                        fontSize: '20px',
                        marginLeft: '3px'
                      }}>{nft.name} Token-{nft.tokenId}</Text>
                      <Card.Body css={{ p: 0 }}>
                        <Card.Image 
                          style={{ maxWidth: '150px', borderRadius: '6%' }}
                          src={nft.img}
                        />
                      </Card.Body>
                      <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row key={id}wrap="wrap" justify="space-between" align="center">
                      <Text wrap="wrap">{nft.desc}</Text>
                      <Text  style={{ fontSize: '30px' }}>{nft.val} <img src='n2dr-logo.png' style={{ width: '60px', height: '25px', marginTop: '4px' }} /></Text>
                      <Button color="gradient" style={{ fontSize: '20px' }} onPress={() => handleConfetti(buylistNft(nft))}>Buy</Button>
                    </Row>
                  </Card.Footer>
                </Card>
                  </Grid>
                )
              })
            }
        </Grid.Container>
      </Container>
        <Spacer></Spacer>
      <Container sm>
        <Row css={{ marginTop: '$3', marginBottom: '$3' }}>
          <Text h3>Latest NFT's on</Text><img src='bsc.png' style={{ width: '190px', height: '45px', marginLeft: '4px' }} />
        </Row>
        <Grid.Container gap={1} justify="flex-start">
          {
            bsctnfts.slice(0, 4).map((nft, i) => (
              <Grid xs={3}>
                <Card style={{ marginRight: '3px', boxShadow: '1px 1px 10px #ffffff' }} variant="bordered" key={i}>
                  <Text style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'SF Pro Display',
                    fontWeight: '200',
                    fontSize: '20px',
                    marginLeft: '3px'
                  }}>{nft.name}</Text>
                  <Card.Body css={{ p: 0}}>
                    <Card.Image
                      style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '6%' }}
                      src={nft.image}
                    />
                  </Card.Body>
                  <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row wrap="wrap" justify="space-between" align="center">
                      <Text wrap="wrap">{nft.description}</Text>
                      <Text style={{ fontSize: '30px' }}>{nft.price}<img src='n2dr-logo.png' style={{ width: '60px', height: '25px', marginTop: '4px' }} /></Text>
                      <Button color="gradient" style={{ fontSize: '20px' }} onClick={() => handleConfetti(buyNewBsct(nft))}>Buy</Button>
                    </Row>
                  </Card.Footer>
                </Card>
              </Grid>
            ))
          }
        </Grid.Container>
        </Container>
        <Container sm>
        <Row css={{ marginTop: '$3', marginBottom: '$3' }}>
          <Text h3>Latest Relisted NFT's on </Text><img src='polygonwhite.png' style={{ width: '190px', height: '45px', marginLeft: '4px' }} />
        </Row>
        <Grid.Container gap={1} justify="flex-start">
          {
            mmlist.slice(0, 9).map((nft, id) => {
                async function buylistNft() {
                  const web3Modal = new Web3Modal()
                  const connection = await web3Modal.connect()
                  const provider = new ethers.providers.Web3Provider(connection)
                  const signer = provider.getSigner()
                  const contract = new ethers.Contract(mmresell, Resell, signer)
                  const transaction = await contract.buyNft(nft.tokenId, { value: nft.cost })
                  await transaction.wait()
                  router.push('/portal')
                }
                return (
                  <Grid xs={3}>
                    <Card style={{ boxShadow: '1px 1px 10px #ffffff' }} variant="bordered" key={id}>
                      <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontFamily: 'SF Pro Display',
                        fontWeight: '200',
                        fontSize: '20px',
                        marginLeft: '3px'
                      }}>{nft.name} Token-{nft.tokenId}</Text>
                      <Card.Body css={{ p: 0 }}>
                        <Card.Image 
                          style={{ maxWidth: '150px', borderRadius: '6%' }}
                          src={nft.img}
                        />
                      </Card.Body>
                      <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row key={id}wrap="wrap" justify="space-between" align="center">
                      <Text wrap="wrap">{nft.desc}</Text>
                      <Text  style={{ fontSize: '30px' }}>{nft.val} <img src='n2dr-logo.png' style={{ width: '60px', height: '25px', marginTop: '4px' }} /></Text>
                      <Button color="gradient" style={{ fontSize: '20px' }} onPress={() => handleConfetti(buylistNft(nft))}>Buy</Button>
                    </Row>
                  </Card.Footer>
                </Card>
                  </Grid>
                )
              })
            }
        </Grid.Container>
      </Container>
      <Container sm>
        <Row css={{ marginTop: '$3', marginBottom: '$3' }}>
          <Text h3>Latest NFT's on</Text><img src='polygonwhite.png' style={{ width: '190px', height: '45px', marginLeft: '4px' }} />
        </Row>
        <Grid.Container gap={1} justify="flex-start">
          {
            mmnfts.slice(0, 4).map((nft, i) => (
              <Grid xs={3}>
                <Card style={{ marginRight: '3px', boxShadow: '1px 1px 10px #ffffff' }} variant="bordered" key={i}>
                  <Text style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'SF Pro Display',
                    fontWeight: '200',
                    fontSize: '20px',
                    marginLeft: '3px'
                  }}>{nft.name}</Text>
                  <Card.Body css={{ p: 0}}>
                    <Card.Image
                      style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '6%' }}
                      src={nft.image}
                    />
                  </Card.Body>
                  <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row wrap="wrap" justify="space-between" align="center">
                      <Text wrap="wrap">{nft.description}</Text>
                      <Text style={{ fontSize: '30px' }}>{nft.price}<img src='n2dr-logo.png' style={{ width: '60px', height: '25px', marginTop: '4px' }} /></Text>
                      <Button color="gradient" style={{ fontSize: '20px' }} onClick={() => handleConfetti(buyNewMum(nft))}>Buy</Button>
                    </Row>
                  </Card.Footer>
                </Card>
              </Grid>
            ))
          }
        </Grid.Container>
        </Container>
    </div>
  )
}