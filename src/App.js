import React from 'react';
import GanttViewer from './ui/GanttViewer';
import MainNav from './ui/MainNav';
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
