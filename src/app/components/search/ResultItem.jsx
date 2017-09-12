import React from 'react';

const ResultItem = (resultItem) => {
  return (
    <div className="result-item cod-md-4">
      <img className="img-thumbnail" src={resultItem.offer.url} />
    </div>
  )
};

export default ResultItem;