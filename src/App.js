import React, { useState, useEffect } from 'react';
import InputForm from './InputForm';
import SymbolCard from './SymbolCard';
import { Container, Row, Col } from 'react-bootstrap';

import Navbar from 'react-bootstrap/Navbar';

const App = () => {
  const [webSocket, setWebSocket] = useState(null);
  const [symbols, setSymbols] = useState({}); // { 'symbolToken': { exchange: '...', messages: [] } }



  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSymbols(prevSymbols => {
        const key = data.symboltoken;
        const newMessages = prevSymbols[key] ? [...prevSymbols[key].messages, data] : [data];
        return { ...prevSymbols, [key]: { exchange: data.exchange, messages: newMessages, scripName: data.scripName } };
      });
    };
    setWebSocket(ws);
  }, []);

  const handleSubmit = (exchange, symbolToken, scripName) => {
    webSocket.send(JSON.stringify({ exchange, symboltoken: symbolToken, scripName: scripName }));
  };


  return (
    <Container >
      <Navbar className="bg-body-tertiary mb-3">
        <Container>
          <Navbar.Brand href="#home">
            Volume Trading UI
          </Navbar.Brand>
        </Container>

      </Navbar>
      <InputForm onSubmit={handleSubmit} />
      <Row>
        {
          Object.entries(symbols).map(([key, { exchange, messages, scripName }]) => (
            <Col md={6} key={key}>
              <SymbolCard exchange={exchange} symbolToken={key} scripName={scripName} messages={messages} />
            </Col>
          ))
        }
      </Row>

    </Container>


  );
};

export default App;
