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
      if(ev.key === 'Enter'){
        submit(ev);
      } else if (ev.key === 'Escape') {
        reset(ev);
      }
    }
    if(this.state.editing){
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
      name = <span className="name">{this.props.closed?(<del>{this.props.children}</del>):this.props.children}</span>;
    }
    return (
      <span onBlur={reset} className="taskName" title={this.props.children} onClick={()=>this.setState({editing:true})}>
        {name}
      </span>
    );
  }
}
