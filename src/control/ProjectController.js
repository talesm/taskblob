import React from 'react';
import Project from '../model/Project';
import Task from '../model/Task';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.project = new Project('Test1', 'Test1');
    this.project.addKid(new Task(1, 'Test1', 'description', 8, 4, false));
    this.project.addKid(new Task(2, 'Test2', 'description', 8, 12, false));
    this.project.addKid(new Task(3, 'Test3', 'description', 8, 4, true));
    this.project.addKid(new Task(4, 'Test4', 'description', 8, 12, true));
    this.state = { project: this.project.toArray() };
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
    const task = new Task(this.project.size(), item.name);
    this.project.addKid(task);
    this.setState({ project: this.project.toArray() });
  }

  editItem = (item) => {
    this.setState({ project: this.project.toArray() });
  }

  eraseItem = (item) => {
    this.project.removeKid(item);
    this.setState({ project: this.project.toArray() });
  }
}
