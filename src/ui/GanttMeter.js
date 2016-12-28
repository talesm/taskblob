import React from 'react';
import './GanttMeter.css'

export default function(props) {
  const style = {
    width: props.width||0
  }
  let className = "meter "+props.type;
  if(props.closed) {
    className += " closed"
  }
  return <span className={className} style={style}/>;
}
