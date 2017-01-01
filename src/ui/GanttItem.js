import React from 'react';
import ItemName from './GanttItemName'
import Meter from './GanttMeter'
import Detail from './GanttItemDetail'
import './GanttItem.css'

export default function(props) {
  const scale = props.scale || 2;
  const meters = [
    'start', 'spentReg', 'overdue', 'remaining', 'unreachable'
  ].map(
    type => <Meter closed={props.closed} key={type} type={type} width={(props[type]||0)*scale+"em"}/>
  );

  return (
    <div className={'item '+(props.className||'')} onClick={props.onClick}>
      <ItemName
        id={props.id}
        closed={props.closed}
        onChange={props.editName}
        onSubmit={props.onSubmit}
        selected={props.selected}
        placeholder={props.placeholder}
        name={props.name}
      >
        {props.children}
      </ItemName>
      {props.selected && Array.isArray(props.dependencies) && <Detail {...props}/>}
      {meters}
    </div>
  );
}
