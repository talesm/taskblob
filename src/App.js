import React from 'react';
import GanttViewer from './ui/GanttViewer';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header>
      		<h1><a href="#">Task Blob</a></h1>
      		<h2>&nbsp;Sua forma rápida e prática de gerenciar tarefas.</h2>
      	</header>
        <section className="viewSection">
          <div className="message"></div>
          <GanttViewer>Tasks</GanttViewer>
        </section>
        <nav className="mainNav buttonset">
      		<button className="add addButton">+ Task</button>
      		<button className="addGroup addButton">+ Group</button>
      		<button className="showExport">Export</button>
      		<button className="showImport">Import</button>
      		<button className="showSettings">Settings</button>
      	</nav>
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
