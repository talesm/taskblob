import React from 'react';
import './GanttItemDetail.css'

export default function (props) {
  return (
    <table className="detail"><tbody>
      <tr>
        <td>Estimated</td>
        <td><input type="number" min="0" max="8760" value={props.duration}/>h</td>
      </tr>
      <tr>
        <td>Spent</td>
        <td><input type="number" min="0" max="8760" value={props.spent}/>h</td>
      </tr>
      <tr>
        <td>Remaining</td>
        <td><input type="number" min="0" max="8760" value={props.duration-props.spent} readOnly/>h</td>
      </tr>
      <tr>
        <td colSpan="2">
          <input type='checkbox' checked={props.closed} onChange={props.editClosed} />
            Closed?
          </td>
      </tr>
    </tbody></table>
  );
}
