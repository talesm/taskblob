import React from 'react';
import MainView from './ui/MainView';
import Project from './model/Project';
import Task from './model/Task';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    const project = new Project('Test1', 'Test1');
    project.addKid(new Task(1, 'Test1', 'description', 8, 4, false));
    project.addKid(new Task(2, 'Test2', 'description', 8, 12, false));
    project.addKid(new Task(3, 'Test3', 'description', 8, 4, true));
    project.addKid(new Task(4, 'Test4', 'description', 8, 12, true));
    this.state = { project };
  }

  render() {
    return <MainView project={this.state.project} />;
  }
}

export default App;
