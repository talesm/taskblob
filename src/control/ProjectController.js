import React from 'react';
import Task from '../model/Task';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { project: props.project.toArray() };
  }

  render() {
    return (
      <this.props.template
        project={this.state.project}
        onInsertItem={this.insertItem}
        onEditItem={this.editItem}
        onEraseItem={this.eraseItem}
      />
    );
  }

  insertItem = (item) => {
    if(!item.name){
      return;
    }
    const task = new Task(this.props.project.size(), item.name);
    this.props.project.addKid(task);
    this.setState({ project: this.props.project.toArray() });
  }

  editItem = (item) => {
    this.setState({ project: this.props.project.toArray() });
  }

  eraseItem = (item) => {
    this.props.project.removeKid(item);
    this.setState({ project: this.props.project.toArray() });
  }
}
