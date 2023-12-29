import React from 'react';
import { Container, Card } from 'react-bootstrap';

import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const SymbolCard = ({ exchange, symbolToken, messages, scripName }) => {

  var generatePopOverFromList = (givenList, id, title) => {
    const popoverId = "popover-basic" + id
    return <Popover id={popoverId} >
      <Popover.Header as="h3">{title}</Popover.Header>
      <Popover.Body style={{ overflowY: 'auto', height: '300px' }}>
        <ul className="list-group list-group-flush">
          {
            givenList.map((msg, index) => (
              <li key={index} className="list-group-item">{msg.message.replace("Significant increase detected:", "SI: ")}</li>
            ))
          }
        </ul>
      </Popover.Body>
    </Popover>
  }

  var parseMsg = (msg) => {
    var { date, date2, multiplier, percentage } = extractValues(msg)
    if (msg.startsWith("Significant increase detected:")) {
      return "SI : " + date + " " + multiplier + " " + percentage
    }
    return "NSI : " + date2
  }

  function extractValues(str) {
    const dateRegex = /\b\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/; // Regex for date in the format 'YYYY-MM-DD HH:MM'
    const date2Regex = /\b\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\b/; // Regex for date in the format 'YYYY-MM-DD HH:MM:SS'
    const multiplierRegex = /\b\d+(\.\d+)?x\b/; // Regex to match numbers followed by 'x'
    const percentageRegex = /\b\d+(\.\d+)?%/; // Regex to match numbers followed by '%'

    const dateMatch = str.match(dateRegex);
    const date2Match = str.match(date2Regex);
    const multiplierMatch = str.match(multiplierRegex);
    const percentageMatch = str.match(percentageRegex);

    const date = dateMatch ? dateMatch[0] : null;
    const date2 = date2Match ? date2Match[0] : null;
    const multiplier = multiplierMatch ? multiplierMatch[0] : null;
    const percentage = percentageMatch ? percentageMatch[0] : null;

    return { date, date2, multiplier, percentage };
  }

  const initialAll = [...messages]
    .reverse()
    .filter(msg => msg.header === "initial analysis")

  const periodicAll = [...messages]
    .reverse()
    .filter(msg => msg.header === "periodic analysis")

  const significant = periodicAll
    .filter(msg => msg.message.startsWith("Significant increase detected:"))
    .concat(initialAll)


  return (
    <Container className="mb-3 p-0">
      <Card style={{ width: '650px' }}>
        <Card.Header className="text-center">
          {`${exchange} - ${scripName} -${symbolToken}`}
        </Card.Header>

        <Card.Body style={{ overflowY: 'auto', height: '250px' }}>
          <ul className="list-group list-group-flush">
            {
              significant.map((msg, index) => (
                <li key={index} className="list-group-item">{msg.message.replace("Significant increase detected:", "SI: ")}</li>
              ))
            }
          </ul>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-center">
          <OverlayTrigger trigger="click" placement="right" overlay={generatePopOverFromList(periodicAll, 1, "Live Analysis All")}>
            <Button variant="success">{periodicAll.length > 0 ? periodicAll[0].message : "All Periodic Data"}</Button>
          </OverlayTrigger>

        </Card.Footer>
      </Card>


    </Container>
  );
};

export default SymbolCard;
