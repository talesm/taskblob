import React from 'react';

export default class extends React.Component {
  constructor(props){
    super(props);
    this.project = props.project;
    this.state = {
      open: true,
      name: props.project.name,
      description: props.project.description,
    };
  }

  render() {
    return <this.props.template
      onOpen={this.open.bind(this)}
      onClose={this.close.bind(this)}
      open={this.state.open}
      projectName={this.state.name}
      projectDescription={this.state.description}
      onProjectNameChange={this.onProjectNameChange.bind(this)}
      onProjectDescriptionChange={this.onProjectDescriptionChange.bind(this)}
    />;
  }

  open() {
    this.setState({open: true});
  }

  close() {
    this.setState({open: false});
  }

  onProjectNameChange(ev) {
    this.setState({name: ev.target.value});
    this.project.name = ev.target.value;
  }
  onProjectDescriptionChange(ev) {
    this.setState({description: ev.target.value});
    this.project.description = ev.target.value;
  }
}
