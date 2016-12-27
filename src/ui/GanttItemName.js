import React from 'react';

export default class extends React.Component {
  constructor(props){
    super(props);
    this.state = {editing:false};
  }

  render(){
    let name;
    const submit = (ev) => {
      this.setState({editing:false});
      if(this.props.onSubmit){
        this.props.onSubmit(ev);
      }
    }
    const reset = (ev) => {
      this.setState({editing:false});
      if(this.props.onReset){
        this.props.onReset(ev);
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
    if(this.props.selected){
      name = (
        <input autoFocus
          className="name"
          value={this.props.children}
          onChange={this.props.onChange}
          onKeyDown={keydown}
          onReset={this.props.onReset}
        />
      );
    } else {
      name = <span className="name">{this.props.children}</span>;
    }
    const classes = ['taskName'];
    if(this.props.selected){
      classes.push('selected')
    }
    if(this.props.closed){
      classes.push('closed')
    }
    return (
      <span onBlur={reset} className={classes.join(' ')} title={this.props.children} onClick={()=>this.setState({editing:true})}>
        {name}
      </span>
    );
  }
}
