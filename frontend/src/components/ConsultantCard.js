// src/components/ConsultantCard.js

import React from 'react';
import '../styles/ConsultantCard.css';

const ConsultantCard = ({ consultant }) => {
  return (
    <div className="consultant-card">
      <h3>{consultant.name}</h3>
      <p><strong>Expertise:</strong> {consultant.expertise}</p>
      <p><strong>Experience:</strong> {consultant.experience}</p>
      <p>{consultant.bio}</p>
      <a href={`mailto:${consultant.email}`} className="book-btn">Contact</a>
    </div>
  );
};

export default ConsultantCard;
