import React from 'react';
import ItemName from './GanttItemName'
import Meter from './GanttMeter'
import Detail from './GanttItemDetail'
import './GanttItem.css'

export default function(props) {
  const meters = [
    'start', 'spent', 'overdue', 'remaining', 'unreachable'
  ].map(
    type => <Meter closed={props.closed} key={type} type={type} width={props[type]}/>
  );

  return (
    <div className={'item '+(props.className||'')} onClick={props.onClick}>
      <ItemName
        closed={props.closed}
        onChange={props.editName}
        onSubmit={props.onSubmit}
        selected={props.selected}
        placeholder={props.placeholder}
      >
        {props.children}
      </ItemName>
      {props.selected && <Detail {...props}/>}
      {meters}
    </div>
  );
}
