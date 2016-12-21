import React from 'react';

export default function(props) {
  let arr = [];
  const min     =+props.min||0
  const max     =+props.max||15
  const interval=+props.interval||5
  for (let i = min+interval; i <= max; i += interval){
    arr.push(<span>{i}{props.unit}</span>);
  }
  return (
    <div className="timeLabel">
      <span>{props.children}</span>
      {arr}
    </div>
  );
}
