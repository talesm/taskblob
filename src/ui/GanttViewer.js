import React from 'react';
import TimeLabel from './TimeLabel'
import Item from './Item';

export default function(props) {
  const items = (props.items||[]).map(item => (
    <Item key={item.id}
      start="0"
      spent={ Math.min(item.spent, item.duration)+"em"}
      remaining={Math.max(item.duration - item.spent, 0)+"em"}
      overdue={Math.max(-item.duration + item.spent, 0)+"em"}
      closed={item.closed}
    >
      {item.name}
    </Item>
  ));
  return (
    <div className="viewGroup">
      <TimeLabel min="0" max="15" interval="5" unit="h">{props.children}</TimeLabel>
      {items}
    </div>
  );
}
