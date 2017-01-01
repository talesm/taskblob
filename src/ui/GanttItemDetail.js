import React from 'react';
import './GanttItemDetail.css'

export default function (props) {
  return (
    <table className="detail"><tbody>
      <tr>
        <td>Estimated</td>
        <td><input type="number" min="0" max="8760" value={props.duration} onChange={props.editDuration||0}/>h</td>
      </tr>
      <tr>
        <td>Spent</td>
        <td><input type="number" min="0" max="8760" value={props.spent} onChange={props.editSpent||0}/>h</td>
      </tr>
      <tr>
        <td>Remaining</td>
        <td><input type="number" min="0" max="8760" value={props.duration-props.spent||0} readOnly/>h</td>
      </tr>
      <tr>
        <td colSpan="2">
          <input type='checkbox' checked={props.closed} onChange={props.editClosed||0} />
          Closed
        </td>
      </tr>
      <tr>
        <td colSpan="2">
          <select multiple
            onChange={props.editDependencies}
            value={props.dependencies.map(dep => props.items.indexOf(dep))}
          >
            {(props.items||[]).map((item, index) => (
              <option
                key={index}
                value={index}
                disabled={props.item === item || item.hasDependency(props.item)}
              >
                {(index+1) + ". " + item.name}
              </option>
            ))}
          </select>
        </td>
      </tr>
      <tr>
        <td></td>
        <td><button onClick={props.erase}>&times; Erase</button></td>
      </tr>
    </tbody></table>
  );
}
