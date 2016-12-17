import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
      		<h1><a href="#">Task Blob</a></h1>
      		<h2>Sua forma rápida e prática de gerenciar tarefas.</h2>
      	</header>
        <section className="viewSection">
          <div className="message"></div>
          <div className="viewGroup">
            <div className="timeLabel">
              <span>Tarefas</span>
              <span>5h</span>
              <span>10h</span>
              <span>15h</span>
            </div>
          </div>
        </section>
        <nav className="mainNav buttonset">
      		<button className="add addButton">Tarefa</button>
      		<button className="addGroup addButton">Grupo</button>
      		<button className="showExport">Exportar</button>
      		<button className="showImport">Importar</button>
      		<button className="showSettings">Configurações</button>
      	</nav>
      	<footer>
      		Copyright 2014 TalesM
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
