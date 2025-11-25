import React from 'react';
import './Spinner.css';

const Spinner = ({ fullPage = true }) => {
  if (fullPage) {
    return <div className="spinner-overlay"><div className="spinner-container"></div></div>;
  }
  return <div className="inline-spinner-container"><div className="spinner-container"></div></div>;
};

export default Spinner;