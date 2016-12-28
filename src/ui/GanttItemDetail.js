import React from 'react';
import './GanttItemDetail.css'

export default function (props) {
  return (
    <table className="detail"><tbody>
      <tr>
        <td>Estimated</td>
        <td><input type="number" min="0" max="8760"/>h</td>
      </tr>
      <tr>
        <td>Spent</td>
        <td><input type="number" min="0" max="8760"/>h</td>
      </tr>
      <tr>
        <td>Remaining</td>
        <td><input type="number" min="0" max="8760"/>h</td>
      </tr>
      <tr>
        <td colSpan="2"><input type='checkbox'/>Closed?</td>
      </tr>
    </tbody></table>
  );
}
