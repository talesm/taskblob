import React from 'react';
import GanttViewer from './GanttViewer';
import MainNav from './MainNav';

export default function(props) {
  return (
    <div className="App">
      <header>
        <h1><a href="#">Task Blob</a></h1>
        <h2>&nbsp;Sua forma rápida e prática de gerenciar tarefas.</h2>
      </header>
      <section className="viewSection">
        <div className="message"></div>
        <GanttViewer items={props.project}>Tasks</GanttViewer>
      </section>
      <MainNav />
      <footer>
        Copyright 2014~2016 TalesM
        <address>
          <a target="_blank" href="http://twitter.com/TalesM">Twitter</a>
          <a href="mailto:tales.miranda88+spamTaskBlob@gmail.com">Email</a>
        </address>
      </footer>
    </div>
  );
}
