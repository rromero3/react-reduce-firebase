import React from 'react';
import ResultItem from './ResultItem';

const ResultList = (props) => {
  const resultItems = props.todaysOffers.map((image) => {
    return <ResultItem key={image.id} offer={image} />
  });

  return (
    <div className="result-list row">{resultItems}</div>
  );
};

export default ResultList;