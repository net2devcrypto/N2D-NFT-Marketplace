import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Web3Modal from "web3modal";
import NFT from '../engine/NFT.json';
import Market from '../engine/Market.json';
import { mmnft, mmmarket } from '../engine/configuration';
import { goenft, goemarket } from '../engine/configuration';
import { hhnft, hhmarket } from '../engine/configuration';
import { bsctnft, bsctmarket } from '../engine/configuration';
import detectEthereumProvider from '@metamask/detect-provider';
import { Card, Button, Input, Col, Row, Spacer, Container, Text } from '@nextui-org/react';
import { client } from '../engine/configuration';
import 'sf-font';

export default function createMarket() {
    const [fileUrl, setFileUrl] = useState(null)
    const [nftcontract, getNft] = useState([])
    const [market, getMarket] = useState([])
    
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })

    useEffect(() => {
      setNft();
    }, [getNft, getMarket])

    const router = useRouter()

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function createMarket() {
        const { name, description, price } = formInput
        if (!name || !description || !price || !fileUrl) return
        const data = JSON.stringify({
            name, description, image: fileUrl
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            createNFT(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function setNft(){
      const web3Modal = new Web3Modal()
      await web3Modal.connect();
      var hh = "0x7a69";
      var goe = "0x5";
      var mm = "0x13881";
      var bsct = "0x61";
      const connected = await detectEthereumProvider();
      if (connected.chainId == hh) {
        var nftcontract = hhnft
      }
      else if (connected.chainId == goe) {
        var nftcontract = goenft
      }
      else if (connected.chainId == mm) {
        var nftcontract = mmnft
      }
      else if (connected.chainId == bsct) {
        var nftcontract = bsctnft
      }
      getNft(nftcontract);
      console.log(nftcontract)
      setMarket();
    }

    async function setMarket(){
      var hh = "0x7a69";
      var goe = "0x5";
      var mm = "0x13881";
      var bsct = "0x61";
      const connected = await detectEthereumProvider();
      if (connected.chainId == hh) {
        var market = hhmarket
      }
      else if (connected.chainId == goe) {
        var market = goemarket
      }
      else if (connected.chainId == mm) {
        var market = mmmarket
      }
      else if (connected.chainId == bsct) {
        var market = bsctmarket
      }
      getMarket(market);
      console.log(market)
    }

    async function createNFT(url) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        let contract = new ethers.Contract(nftcontract, NFT, signer)
        let transaction = await contract.createNFT(url)
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        contract = new ethers.Contract(market, Market, signer)
        let listingFee = await contract.listingFee()
        listingFee = listingFee.toString()
        transaction = await contract.createVaultItem(nftcontract, tokenId, price, { value: listingFee })
        await transaction.wait()
        router.push('/')
    }

    async function buyNFT() {
        const { name, description } = formInput
        if (!name || !description || !fileUrl) return
        const data = JSON.stringify({
            name, description, image: fileUrl
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            mintNFT(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function mintNFT(url) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        let contract = new ethers.Contract(nftcontract, NFT, signer)
        let cost = await contract.cost()
        let transaction = await contract.mintNFT(url, { value: cost })
        await transaction.wait()
        router.push('/portal')
    }

    return (
        <div>
          <Spacer></Spacer>
          <Container lg gap={2} css={{ fontFamily: 'SF Pro Display', fontWeight: '200' }}>
          <Text h2>NFT Creator Portal</Text>
            <Row gap={4}>
              <Col>
              <Spacer></Spacer>
              <Spacer></Spacer>
                <Spacer></Spacer>
                <Text h3 className='ml-3'>The NFT Marketplace with a Reward.</Text>
                <Text h3>N2DR IS More Than A Token</Text>
                <Spacer></Spacer>
                <img src='n2dr-logo.png' width={"300px"} />
              </Col>
              <Col css={{ marginRight: '$7' }}>
              <Spacer></Spacer>
                <Card css={{ marginTop: '$5', marginBottom: '$5' }}>
                  <Card.Body style={{ backgroundColor: "#00000040" }}>
                    <Text>Select your Preferred Network, Create your Amazing NFT by uploading your art using the simple NFT Dashboard. Simple!</Text>
                  </Card.Body>
                </Card>
                <img src='chainagnostic.png' />
                <Card css={{ marginTop: '$5' }} >
                  <Card.Body style={{ backgroundColor: "#00000040" }}>
                    <Text>Chain-Agnostic Marketplace that allows you to sell your NFT and accept your favorite crypto as payment! No borders, No restrictions. Simple!</Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
              <Spacer></Spacer>
                <Text h3>Create and Sell your NFT in the Marketplace</Text>
                <Card style={{ maxWidth: '300px', background: '#ffffff05', boxShadow: '0px 0px 5px #ffffff60' }}>
                  <Card css={{ marginTop: '$1' }}>
                    <Card.Body style={{ backgroundColor: "#000000" }}>
                    <Input
                    placeholder='Enter your NFT Name'
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                  />
                  </Card.Body>
                  </Card>
                  <Card >
                <Card.Body style={{ backgroundColor: "#000000" }}>
                  <Input
                    placeholder="NFT Description"
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                  />
                </Card.Body>
              </Card>
              <Card>
                <Card.Body style={{ backgroundColor: "#000000" }}>
                  <input
                    type="file"
                    name="Asset"
                    onChange={onChange}
                  />
                  {
                    fileUrl && (
                      <img className="rounded " width="350" src={fileUrl} />
                    )
                  }
                </Card.Body>
              </Card>
              <Container css={{ marginBottom: '$2' }}>
                <Input
                  css={{ marginTop: '$2' }}
                  placeholder="Set your price in N2DR"
                  onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
                <Button size="sm" style={{ fontSize: '20px' }} onPress={createMarket} css={{ marginTop: '$2', marginBottom: '$5', color:'$gradient' }}>
                  List your NFT!
                </Button>
                <Button size="sm" style={{ fontSize: '20px' }} onPress={buyNFT} css={{ marginTop: '$2', marginBottom: '$5', color:'$gradient' }}>
                  Buy your NFT!
                </Button>
                </Container>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
