import React from 'react';

export default function(props) {
  return (
    <nav className="mainNav buttonset">
      <button className="add addButton">+ Task</button>
      <button className="addGroup addButton">+ Group</button>
      <button className="showExport">Export</button>
      <button className="showImport">Import</button>
      <button className="showSettings">Settings</button>
    </nav>
  );
}
