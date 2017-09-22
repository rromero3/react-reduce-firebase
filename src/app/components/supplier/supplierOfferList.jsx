import React from 'react';
import SupplierOfferItem from './SupplierOfferItem';

const SupplierOfferList = (props) => {
  const resultItems = props.supplierOffers.map((offer) => {
    return <SupplierOfferItem key={offer.id} offer={offer} />
  });

  return (
    <div className="row">{resultItems}</div>
  );
};

export default SupplierOfferList;