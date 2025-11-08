import React from 'react';

const Card = ({ children, className = '', onClick, hover = false }) => {
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';
  
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-6 ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
