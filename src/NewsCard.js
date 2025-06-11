// src/components/NewsCard.js
import React from 'react';

const NewsCard = ({ title, description }) => {
  return (
    <div className="news-card">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default NewsCard;