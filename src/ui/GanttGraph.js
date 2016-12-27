import React from 'react';
import TimeLabel from './TimeLabel'
import Item, {AddNewItem} from './GanttItem';
import ItemController from '../control/ItemController'

export default class extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      selected: null
    }
  }

  render() {
    const items = (this.props.items||[]).map((item, index) => (
      <ItemController
        template={Item}
        key={item.id}
        item={item}
        selected={this.state.selected === index}
        onSubmit={this.props.onEditItem}
        onClick={()=>this.setState({selected: index})}
      >
        {item.name}
      </ItemController>
    ));
    return (
      <div className="viewGroup" onKeyDown={this.onKeyDown}>
        <TimeLabel min="0" max="15" interval="5" unit="h">{this.props.children}</TimeLabel>
        {items}
        <ItemController
          template={AddNewItem}
          onSubmit={this.props.onInsertItem}
          selected={this.state.selected === this.props.items.length}
          onClick={()=>this.setState({selected: this.props.items.length})}
        >
          Add New Task
        </ItemController>
      </div>
    );
  }

  onKeyDown = (ev) => {
    switch (ev.key) {
      case 'ArrowUp':
        this.setState({selected: Math.max(0, (this.state.selected||1) -1)})
        break;
      case 'ArrowDown':
        this.setState({selected: Math.min(this.props.items.length, (this.state.selected +1)||0)})
        break;
      default:
        console.log(ev.key);
        break;
    }
  }
}
