import React from 'react';
import Task from '../model/Task'

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {item: new Task(0, "New Item")};
  }

  componentDidMount() {
    if(this.props.item){
      this.setState({item: this.props.item});
    }
  }

  componentWillUnmount() {

  }

  render() {
    const start=0;
    const item = this.state.item;
    const itemInfo = {
      start:     start*2+"em",
      spent:     item.spentReg()*2+"em",
      remaining: item.remaining()*2+"em",
      overdue:   item.overdue()*2+"em",
      closed:    item.closed,
    }
    return (
      <this.props.template {...itemInfo} onSubmit={this.submit} editName={this.editName} onReset={this.reset}>
        {this.state.item.name}
      </this.props.template>
    );
  }

  editName = (ev) => {
    const item = this.state.item;
    item.name = ev.target.value;
    this.setState({item});
  }

  submit = (ev) => {
    if(this.props.onSubmit){
      this.props.onSubmit(this.state.item)
    } else {
      this.reset();
    }
  }

  reset = () => {
    this.componentDidMount();
  }
}
