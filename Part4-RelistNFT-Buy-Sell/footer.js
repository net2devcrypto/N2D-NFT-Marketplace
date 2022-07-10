import 'sf-font';
import { Text, Row, Spacer, Container, Col } from '@nextui-org/react';

export default function Footer() {

    const footer1 = [
        {
            id: 1,
            img: "discord.png",
            url: "https://discord.com/"
        },
        {
            id: 2,
            img: "youtube.png",
            url: "https://www.youtube.com/"
        },
        {
            id: 3,
            img: "twitter.png",
            url: "https://twitter.com/"
        }
    ]

    const footer2 = [
        {
            id: 1,
            img: "bsc.png"
        },
        {
            id: 2,
            img: "polygonwhite.png"
        },
        {
            id: 3,
            img: "ethereumlogo.png"
        }
    ]


return (
    <div>
    <Spacer></Spacer>
<Container style={{borderTop:'1px solid #B22222'}}>
    <Container md gap={3}>
    <Spacer></Spacer>
                <Row gap={3}>
                    <Col>                            
                            <a href="/">
                            <Text h2 style={{color:"#fff",fontSmooth:"always",textShadow:"-0px 0px 3px #ffffff",fontFamily:"SF Pro Display",fontWeight:"700"}}>n2DMarket</Text>
                            </a>
                            <Text style={{color:"#fff",fontSmooth:"always",fontFamily:"SF Pro Display"}}>The blockchain agnostic marketplace. The token with endless posibilities. NFT's are more than just art. Its meant to change the way humans establish ownership of an asset beyond paper.</Text>
                       </Col>
                    </Row>
                    <Row gap={3}>
                    <Col>
                            <Text style={{marginTop:"3px"}} h4>Follow Us!</Text>
                            <ul>
                                {footer1.map((item, idx) => {
                                    return (
                                        <a href={item.url}><img src={item.img} style={{marginRight:'1px'}} width="150px" height="50px"></img></a>
                                    );
                                })}
                            </ul>
                    </Col>
                    <Col>
                            <Text h4>Integrations</Text>
                            <ul>
                                {footer2.map((item, idx) => {
                                    return (
                                        <img src={item.img} style={{marginRight:'5px'}} width="150px" height="50px"></img>
                                    );
                                })}
                            </ul>
                    </Col>
                    <Col style={{marginLeft:'5px'}}>
                            <Text h4>Our Partners</Text>
                               <a href=""><img src="discordlogo.png"
                               style={{
                                   width:"200px"
                               }}
                               /></a>
                    </Col>
                </Row>
               <Row gap={3}>
                            <Text>©2022 N2DMarket, All Rights Reserved.</Text>
                </Row>
    </Container>
    </Container>
    </div>
);

}