import React from 'react';

export default function(props) {
  let name;
  const submit = (ev) => {
    if(props.onSubmit){
      props.onSubmit(ev);
    }
  }
  const reset = (ev) => {
    if(props.onReset){
      props.onReset(ev);
    }
  }
  const keydown = (ev) => {
    switch (ev.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
        submit(ev);
        break;
      case 'Escape':
        reset(ev);
        break;
      default:
        break;
    }
  }
  if(props.selected){
    name = (
      <input autoFocus
        className="name"
        value={props.children}
        onChange={props.onChange}
        onKeyDown={keydown}
        onReset={props.onReset}
      />
    );
  } else {
    name = <span className="name">{props.children}</span>;
  }
  const classes = ['taskName'];
  if(props.selected){
    classes.push('selected')
  }
  if(props.closed){
    classes.push('closed')
  }
  return (
    <span onBlur={reset} className={classes.join(' ')} title={props.children}>
      {name}
    </span>
  );
}
