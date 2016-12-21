import React from 'react';
import TimeLabel from './ui/TimeLabel'
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
          <div className="viewGroup">
            <TimeLabel min="0" max="15" interval="5" unit="h">Tasks</TimeLabel>
          </div>
        </section>
        <nav className="mainNav buttonset">
      		<button className="add addButton">Tarefa</button>
      		<button className="addGroup addButton">Grupo</button>
      		<button className="showExport">Exportar</button>
      		<button className="showImport">Importar</button>
      		<button className="showSettings">Configurações</button>
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
