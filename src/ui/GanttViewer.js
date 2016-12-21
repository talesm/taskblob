import React from 'react';
import TimeLabel from './TimeLabel'
import Item from './Item';

export default function(props) {
  return (
    <div className="viewGroup">
      <TimeLabel min="0" max="15" interval="5" unit="h">{props.children}</TimeLabel>
      <Item start="5em" spent="7.5em">A name</Item>
    </div>
  );
}
