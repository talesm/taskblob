import React from 'react';

function Meter(props) {
  const style = {
    width: props.width||0
  }
  let className = "meter "+props.type;
  if(props.closed) {
    className += " closed"
  }
  return <span className={className} style={style}/>;
}

function AddNewItem(props) {
  return (
    <div className="item placeholder">
      <span className="taskName" title="{props.children}">
        <span className="name">{props.children}</span>
      </span>
    </div>
  );
}

export {AddNewItem, Meter};

export default function(props) {
  const meters = ['start', 'spent', 'overdue', 'remaining', 'unreachable']
      .map(type => <Meter closed={props.closed} key={type} type={type} width={props[type]}/>);

  return (
    <div className="item">
      <span className="taskName" title={props.children}>
        <span className="name">{props.closed?(<del>{props.children}</del>):props.children}</span>
      </span>
      {meters}
    </div>
  );
}
