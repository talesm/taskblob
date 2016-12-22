import React from 'react';
import GanttViewer from './ui/GanttViewer';
import MainNav from './ui/MainNav';
import Project from './model/Project';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: [
        {id: 1, name: "Task1", description: "A task", duration: 7, spent: 5, closed: false, dependencies: []},
        {id: 2, name: "Task2", description: "A task", duration: 3, spent: 5, closed: false, dependencies: []},
        {id: 3, name: "Task3", description: "A task", duration: 7, spent: 5, closed: true, dependencies: []},
        {id: 4, name: "Task4", description: "A task", duration: 3, spent: 5, closed: true, dependencies: []},
      ]
    }
  }

  render() {
    return (
      <div className="App">
        <header>
      		<h1><a href="#">Task Blob</a></h1>
      		<h2>&nbsp;Sua forma rápida e prática de gerenciar tarefas.</h2>
      	</header>
        <section className="viewSection">
          <div className="message"></div>
          <GanttViewer items={this.state.project}>Tasks</GanttViewer>
        </section>
        <MainNav />
      	<footer className>
      		Copyright 2014~2016 TalesM
      		<address>
      			<a target="_blank" href="http://twitter.com/TalesM">Twitter</a>
      			<a href="mailto:tales.miranda88+spamTaskBlob@gmail.com">Email</a>
      		</address>
      	</footer>
      </div>
    );
  }
}

export default App;
