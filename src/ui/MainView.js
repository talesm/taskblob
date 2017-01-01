import React from 'react';
import GanttViewer from './GanttGraph';

export default function(props) {
  return (
    <div className="App">
      <GanttViewer
        items={props.project}
        onInsertItem={props.onInsertItem}
        onEditItem={props.onEditItem}
        onEraseItem={props.onEraseItem}
      >
        Tasks
      </GanttViewer>
    </div>
  );
}
