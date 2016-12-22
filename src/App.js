import React from 'react';
import MainView from './ui/MainView';
import Project from './model/Project';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: new Project('Test1', 'Test1')
    }
  }

  render() {
    return <MainView project={this.state.project} />;
  }
}

export default App;
