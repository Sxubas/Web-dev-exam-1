import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Editor.css';
import Input from './Input';
import Visualization from '../Visualization';

class Editor extends Component {

  constructor() {
    super();
    const defaultSpec = {
      '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
      'description': 'A simple bar chart with embedded data.',
      'data': {
        'name': 'myData'
      },
      'mark': 'bar',
      'encoding': {
        'y': { 'field': 'a', 'type': 'ordinal' },
        'x': { 'field': 'b', 'type': 'quantitative' }
      }
    };

    const defaultData = [
      { 'a': 'Jan', 'b': 28 }, { 'a': 'Feb', 'b': 55 }, { 'a': 'Mar', 'b': 43 },
      { 'a': 'Apr', 'b': 91 }, { 'a': 'May', 'b': 81 }, { 'a': 'Jun', 'b': 53 },
      { 'a': 'Jul', 'b': 19 }, { 'a': 'Ago', 'b': 87 }, { 'a': 'Sep', 'b': 52 },
      { 'a': 'Oct', 'b': 52 }, { 'a': 'Nov', 'b': 52 }, { 'a': 'Dic', 'b': 52 }
    ];

    this.state = {
      spec: defaultSpec,
      visText: JSON.stringify(defaultSpec, null, 2),
      parseError: null,
      specError: null,
      data: defaultData,
      uploadMessage: ''
    };

    this.handleInput = this.handleInput.bind(this);
    this.prettify = this.prettify.bind(this);
    this.updateCSV = this.updateCSV.bind(this);
  }

  prettify() {
    this.setState({ visText: JSON.stringify(this.state.spec, null, 2) });
  }

  handleInput(event) {
    if (!event) return; //Nothing has changed 

    const input = event.target.value;
    try {
      const spec = JSON.parse(input);
      this.setState({ spec, visText: input, specError: '', parseError: '' });
    }
    catch (error) {
      this.setState({ parseError: error.message, visText: input });
    }
  }

  updateCSV(data) {
    this.setState({ data });
  }

  publishVisualization(name) {

    console.log(name);

    if (this.state.parseError || this.state.specError) {
      this.setState({ uploadMessage: 'Cannot publish a visualization with errors' });
    }
    else if (!name) {
      this.setState({ uploadMessage: 'The name should not be empty' });
    }

    if (name) {

      this.setState({ uploadMessage: 'Uploading...' });

      let postData = [];

      //Only save first 1000 registers to mongo
      if (this.state.data.length > 1000) {
        postData = this.state.data.slice(0, 1000);
      }
      else {
        postData = this.state.data;
      }

      fetch('/visualizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          data: postData,
          spec: this.state.spec,
          rating: 0,
          votes: 0
        })
      }).then(res => res.json()).then(json => {
        if (json.errorMessage) {
          this.setState({ uploadMessage: json.errorMessage });
        }
        else {
          this.setState({ uploadMessage: 'Vis uploaded successfully!' });
        }
      })
        .catch(err => this.setState({ uploadMessage: err.message }));
    }
  }

  restoreVisualization() {
    if (this.props.exploredVisualization) {
      this.setState({
        visText: JSON.stringify(this.props.exploredVisualization.spec, null, 2),
        spec: this.props.exploredVisualization.spec
      });
    }
    else {
      this.setState({
        visText: '{"$schema": "https://vega.github.io/schema/vega-lite/v2.json"}',
        spec: { '$schema': 'https://vega.github.io/schema/vega-lite/v2.json' }
      });
    }
  }

  render() {

    return (
      <div className='app'>
        <div className='editor-container'>

          <Input
            visText={this.state.visText}
            restoreVisualization={() => this.restoreVisualization()}
            publishVisualization={name => this.publishVisualization(name)}
            updateCSV={this.updateCSV}
            handleInput={this.handleInput}
            prettify={this.prettify}
            parseError={this.state.parseError}
            specError={this.state.specError}
            uploadMessage={this.state.uploadMessage}
          />

          <div className='vertical-hr' />

          <div className='editor-visualization-container'>
            <h2>Here is your visualization:</h2>
            <Visualization
              spec={this.state.spec}
              data={this.state.data}
              specError={this.state.specError}
              onSpecError={error => this.setState({ specError: error.message })}
            />
          </div>
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  exploredVisualization: PropTypes.object
};

export default Editor;
