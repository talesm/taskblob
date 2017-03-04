import React from 'react';
import ReactModal from 'react-modal';
import './SettingsView.css';

export default function(props) {
  return (
    <div className="Settings">
      <button id="cogButton" className={props.open && 'open' } onClick={(props.open?props.onClose:props.onOpen)}>&#x2699;</button>
      <ReactModal isOpen={props.open} onCloseRequest={props.onClose} contentLabel="Settings" style={{overlay: {
        zIndex: 10,
      }}} shouldCloseOnOverlayClick={true}>
        <h2>Settings</h2>
        <div className="settingsTable">
          <div>
            <label htmlFor="projectName">Project Name:</label>
            <input id="projectName" value={props.projectName} onChange={props.onProjectNameChange}/>
          </div>
          <div>
            <label htmlFor="projectDescription">Description:</label>
            <textarea id="projectDescription" value={props.projectDescription} onChange={props.onProjectDescriptionChange}/>
          </div>
          <div>
            <span>Export Options:</span>
            <div>
              <button onClick={props.saveToDisk}>Disk</button>
              <button onClick={props.saveToDropbox}>Dropbox</button>
            </div>
          </div>
          <div>
            <span>Import Options:</span>
            <div>
              <button onClick={props.loadFromDisk}>Disk</button>
              <button onClick={props.loadFromDropbox}>Dropbox</button>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}
