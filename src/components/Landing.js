import React from 'react';
import { Button, Row, Col } from 'reactstrap';
import img from '../img/JMDB.png'
const LandingPage = () =>
  <div>
    <h1>Välkommen Jönsers Movie Database!</h1>
    <Row>
        <Col>
            <span>Är du medlem? </span><br />
            <Button color="success" href="/signin">Logga in</Button><br /><br />
            <span>Är du inte medlem? </span><br />
            <Button color="info" href="/signup">Skapa konto</Button>
        </Col>
        <Col><img src={img} alt="JMBD"/></Col>
    </Row>
  </div>

export default LandingPage;