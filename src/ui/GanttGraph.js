import React from 'react';
import TimeLabel from './TimeLabel'
import GanttItem from './GanttItem';
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
        template={GanttItem}
        key={item.id}
        item={item}
        selected={this.state.selected === index}
        onSubmit={this.props.onEditItem}
        onClick={this.onClickItem.bind(this, index)}
      >
        {item.name}
      </ItemController>
    ));
    const length = this.props.items.length;
    return (
      <div
        className="viewGroup"
        onKeyDown={this.onKeyDown}
        onClick={this.onClick}
      >
        <TimeLabel min="0" max="15" interval="5" unit="h">{this.props.children}</TimeLabel>
        {items}
        <ItemController
          template={GanttItem}
          className="placeholder"
          onSubmit={this.props.onInsertItem}
          selected={this.state.selected === length}
          onClick={this.onClickItem.bind(this, length)}
          placeholder="Add New Task"
        />
      </div>
    );
  }

  onClickItem(index, ev){
    this.setState({selected: index});
    ev.stopPropagation();
  }

  onClick = (ev) => {
    this.setState({selected: null});
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
