import React from 'react';
import Task from '../model/Task'

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {item: new Task(0, "New Item")};
  }

  componentDidMount() {
    if(this.props.item){
      this.setState({item: this.props.item})
    }
  }

  componentWillUnmount() {

  }

  render() {
    const start=0;
    const item = this.state.item;
    const itemInfo = {
      spent:     item.spentReg()*2+"em",
      remaining: item.remaining()*2+"em",
      overdue:   item.overdue()*2+"em",
      closed:    item.closed,
    }
    return (
      <this.props.template {...itemInfo} onSubmit={this.submit}>
        {this.state.item.name}
      </this.props.template>
    );
  }

  submit = () => {

  }
}
