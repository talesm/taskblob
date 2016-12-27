import React from 'react';
import TimeLabel from './TimeLabel'
import Item, {AddNewItem} from './GanttItem';
import ItemController from '../control/ItemController'

export default function(props) {
  const items = (props.items||[]).map(item => (
    <ItemController template={Item} key={item.id} item={item} onSubmit={props.onEditItem}>
      {item.name}
    </ItemController>
  ));
  return (
    <div className="viewGroup">
      <TimeLabel min="0" max="15" interval="5" unit="h">{props.children}</TimeLabel>
      {items}
      <ItemController template={AddNewItem} onSubmit={props.onInsertItem}>Add New Task</ItemController>
    </div>
  );
}
