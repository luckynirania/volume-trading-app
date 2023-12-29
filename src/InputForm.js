import React, { useState, useEffect, useCallback } from 'react';
import { FloatingLabel, Form, Row, Col, Button } from 'react-bootstrap';
import _ from 'lodash';

const InputForm = ({ onSubmit }) => {
  const [exchange, setExchange] = useState('');
  const [symbolToken, setSymbolToken] = useState('');
  const [scripName, setScripName] = useState('');

  const [webSearchSocket, setSearchWebSocket] = useState(null);
  const [searchData, setSearchData] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(exchange, symbolToken, scripName);
  };

  const handleSuggestionClick = (symbol, scripName) => {
    setSymbolToken(symbol);
    setScripName(scripName)
    setSearchData([]); // Clear the suggestions list after selection
  };

  const SuggestionList = () => {
    if (searchData.length === 0) {
      return null;
    }

    return (
      <ul className="list-group">
        {searchData.map((item, index) => (
          <li
            key={index}
            className="list-group-item list-group-item-action"
            onClick={() => handleSuggestionClick(item.symboltoken, item.tradingsymbol)}
          >
            {item.tradingsymbol} - {item.symboltoken}
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    const wss = new WebSocket('ws://127.0.0.1:8000/search');
    wss.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success === true) {
        setSearchData(data.message.filter(item => item.tradingsymbol.includes("FUT") || item.tradingsymbol.includes("-EQ")));
      } else {
        setSearchData([]);
      }

    };
    setSearchWebSocket(wss);

    // Clean up the WebSocket connection when the component unmounts

  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(_.debounce((exchange, searchScrip) => {
    if (webSearchSocket && webSearchSocket.readyState === WebSocket.OPEN) {
      webSearchSocket.send(JSON.stringify({ exchange, searchscrip: searchScrip }));
    }
  }, 500), [webSearchSocket]); // 500 ms debounce time

  const handleSymbolChange = (searchScrip) => {
    setSymbolToken(searchScrip);
    if (searchScrip !== "") {
      debouncedSearch(exchange, searchScrip);
    }

  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Row className="g-3 align-items-center">
        <Col>
          <FloatingLabel controlId="floatingExchange" label="Exchange">
            <Form.Select
              aria-label="Exchange select"
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              required
            >
              <option value="">Select Exchange</option>
              <option value="NFO">NFO</option>
              <option value="NSE">NSE</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel controlId="floatingSymbol" label="Symbol">
            <Form.Control
              type="text"
              placeholder="55390"
              value={symbolToken}
              onChange={(e) => handleSymbolChange(e.target.value)}
              required
            />
            <SuggestionList />
          </FloatingLabel>
        </Col>
        <Col xs="auto">
          <Button type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default InputForm;

