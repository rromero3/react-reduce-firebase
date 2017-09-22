import React from 'react';

const ResultItem = (resultItem) => {
  return (
    <div className="result-item col-xs-6 col-md-3 thumbnail">
      <img className="img-thumbnail" src={resultItem.offer.url} alt="{resultItem.offer.alt}" />
      <div className="caption">
      	<h3> {resultItem.offer.text} <span className="badge">Ya fueron {resultItem.offer.badgeCount}</span> </h3>  
      	<p>{resultItem.offer.description} </p> <span className="label label-warning">A punto de expirar</span>
      </div>
    </div>
  )
};

export default ResultItem;