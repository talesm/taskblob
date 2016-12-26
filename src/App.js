import React from 'react';
import MainView from './ui/MainView';
import ProjectController from './control/ProjectController';
import './App.css';

class App extends React.Component {
  render() {
    return <ProjectController template={MainView}/>;
  }
}

export default App;
