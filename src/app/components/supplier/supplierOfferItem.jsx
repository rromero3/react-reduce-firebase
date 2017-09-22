import React from 'react';

const SupplierOfferItem = (resultItem) => {
  return (
      <div className="media">
  		<div className="media-left">
    		<a href="#">
      			<img class="media-object" src={resultItem.offer.url} alt={resultItem.offer.imgAlt}></img>
    		</a>
  		</div>
  		<div className="media-body">
    		<h4 className="media-heading">{resultItem.offer.text}</h4>
    		<p>{resultItem.offer.description}</p>
  		</div>
	</div>
  )
};

export default SupplierOfferItem;