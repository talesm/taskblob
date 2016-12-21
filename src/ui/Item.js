import React from 'react';

function Meter(props) {
  const style = {
    width: props.width||0
  }
  const className = "meter "+props.type;
  return <span className={className} style={style}/>;
}

export default function(props) {
  const meters = ['start', 'spent', 'remaining', 'overdue', 'unreachable', 'leftover']
      .map(type => <Meter key={type} type={type} width={props[type]}/>);

  return (
    <div className="item">
      <span className="taskName" title={props.children}>
        <span className="name">{props.children}</span>
      </span>
      {meters}
    </div>
  );
}
