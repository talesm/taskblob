import React from 'react';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {item: {}};
  }

  componentDidMount() {
    if(this.props.item) {
      this.setState({item: this.props.item});
    } else {
      this.setState({item: {name: this.props.children||''}});
    }
  }

  componentWillUnmount() {

  }

  render() {
    const start=0;
    const item = this.state.item;
    const itemInfo = item.name?{
      start:     start,
      duration:  item.duration,
      spent:     item.spent,
      spentReg:  Math.min(item.spent, item.duration),
      remaining: Math.max(item.duration - item.spent, 0),
      overdue:   Math.max(item.spent - item.duration, 0),
      closed:    item.closed,
    } : {};
    return (
      <this.props.template
        {...this.props}
        {...itemInfo}
        onSubmit={this.submit}
        editName={this.editName}
        editDuration={this.editDuration}
        editSpent={this.editSpent}
        editClosed={this.editClosed}
        onReset={this.reset}
        scale="2"
      >
        {this.state.item.name}
      </this.props.template>
    );
  }

  editName = (ev) => {
    const item = this.state.item;
    item.name = ev.target.value;
    this.setState({item});
  }

  editDuration = (ev) => {
    const item = this.state.item;
    item.duration = ev.target.value;
    this.setState({item});
  }

  editSpent = (ev) => {
    const item = this.state.item;
    item.spent = ev.target.value;
    this.setState({item});
  }

  editClosed = (ev) => {
    const item = this.state.item;
    item.closed = ev.target.checked;
    this.setState({item});
  }

  submit = (ev) => {
    if(this.props.onSubmit){
      this.props.onSubmit(this.state.item)
    }
    this.reset();
  }

  reset = () => {
    this.componentDidMount();
  }
}
