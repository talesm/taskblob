import React from 'react';
import TimeLabel from './TimeLabel'
import GanttItem from './GanttItem';
import ItemController from '../control/ItemController'

export default class extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
      showSelected: false,
    }
    //A bad thing, for a good cause.
    window.onkeydown = this.onKeyDown;
  }

  render() {
    const items = (this.props.items||[]).map((item, index) => (
      <ItemController
        template={GanttItem}
        key={item.id}
        item={item}
        selected={this.state.selected === index && this.state.showSelected}
        onSubmit={this.props.onEditItem}
        onErase={this.onEraseItem}
        onClick={this.onClickItem.bind(this, index)}
        items={this.props.items}
      >
        {index}. {item.name}
      </ItemController>
    ));
    const length = this.props.items.length;
    return (
      <div
        className="viewGroup"
        onClick={this.onClick}
      >
        <TimeLabel min="0" max="15" interval="5" unit="h">{this.props.children}</TimeLabel>
        {items}
        <ItemController
          template={GanttItem}
          className="placeholder"
          onSubmit={this.props.onInsertItem}
          selected={this.state.selected === length && this.state.showSelected}
          onClick={this.onClickItem.bind(this, length)}
          placeholder="Add New Task"
        />
      </div>
    );
  }

  onClickItem(index, ev){
    this.setState({selected: index, showSelected: true});
    ev.stopPropagation();
  }

  onClick = (ev) => {
    this.setState({showSelected: false});
  }

  onKeyDown = (ev) => {
    switch (ev.key) {
      case 'ArrowUp':
        this.setState({selected: Math.max(0, this.state.selected -1), showSelected: true})
        break;
      case 'ArrowDown':
        this.setState({selected: Math.min(this.props.items.length, this.state.selected +1), showSelected: true})
        break;
      case 'Escape':
        this.setState({showSelected: false});
        break;
      default:
        break;
    }
  }

  onEraseItem = (item) => {
    this.setState({showSelected: false});
    this.props.onEraseItem(item);
  }
}
