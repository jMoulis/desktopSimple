import React from 'react';
import './index.css';

const ListMessages = ({ messages }) => (
  <ul className="messages">
    {messages && messages.map((message, index) => <li key={index}>{message}</li>)}
  </ul>
);

export default ListMessages;
