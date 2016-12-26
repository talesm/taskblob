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

class TaskName extends React.Component {
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
        <input
          className="name"
          value={this.props.children}
          onBlur={submit}
          onChange={this.props.onChange}
          onKeyDown={keydown}
          onReset={this.props.onReset}
        />
      );
    } else {
      name = <span className="name">{this.props.closed?(<del>{this.props.children}</del>):this.props.children}</span>;
    }
    return (
      <span className="taskName" title={this.props.children} onClick={()=>this.setState({editing:true})}>
        {name}
      </span>
    );
  }
}

function AddNewItem(props) {
  return (
    <div className="item placeholder">
      <TaskName closed={props.closed} onChange={props.editName} onSubmit={props.onSubmit}>{props.children}</TaskName>
    </div>
  );
}

export {AddNewItem, Meter};

export default function(props) {
  const meters = ['start', 'spent', 'overdue', 'remaining', 'unreachable']
      .map(type => <Meter closed={props.closed} key={type} type={type} width={props[type]}/>);

  return (
    <div className="item">
      <TaskName closed={props.closed}>{props.children}</TaskName>
      {meters}
    </div>
  );
}
