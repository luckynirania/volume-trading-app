import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';

const SymbolCardV2 = ({ exchange, symbolToken, messages }) => {
	const [showModal, setShowModal] = useState(false);
	const [modalContent, setModalContent] = useState([]);

	const openModal = (header) => {
		const filteredMessages = messages.filter(msg => msg.header === header);
		setModalContent(filteredMessages);
		setShowModal(true);
	};

	const getLatestMessage = (header) => {
		const latestMessage = messages.find(msg => msg.header === header);
		return latestMessage ? latestMessage.message : 'No data';
	};

	return (
		<Container className="mb-3 p-0">
			<Card>
				<Card.Header className="text-center">
					{`${exchange} - ${symbolToken}`}
				</Card.Header>
				<Card.Body style={{ overflowY: 'auto', height: '400px' }}>
					<ul className="list-group list-group-flush">
						{
							messages
								.filter(msg => msg.message.startsWith("Significant increase detected:") && msg.header === "periodic analysis")
								.map((msg, index) => (
									<li key={index} className="list-group-item">{msg.message}</li>
								))
						}
					</ul>
				</Card.Body>
				<Card.Footer>
					<Row>
						<Col onClick={() => openModal('periodic analysis')}>
							<div className="footer-item">Live Analysis: {getLatestMessage('periodic analysis')}</div>
						</Col>
						<Col onClick={() => openModal('initial analysis')}>
							<div className="footer-item">Initial Analysis: {getLatestMessage('initial analysis')}</div>
						</Col>
					</Row>
				</Card.Footer>
			</Card>

			{/* Modal */}
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Details</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{
						modalContent.map((msg, index) => (
							<p key={index}>{msg.message}</p>
						))
					}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default SymbolCardV2;
