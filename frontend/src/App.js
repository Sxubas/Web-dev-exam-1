import React, { Component } from 'react';
import Explorer from './components/Explorer/Explorer';
import Editor from './components/Editor/Editor';
import './App.css';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      onEditor: true,
      exploredVisualization: null
    };
  }

  render() {
    return (
      <div className='app'>

        <div className='banner-container'>
          <h1>Minimalistic Vega Visualization</h1>
          <button onClick={() => this.setState({ onEditor: !this.state.onEditor })} className='explore-button'>Explore more visualizations</button>
        </div>

        {this.state.onEditor ?
          <Editor explored={this.state.exploredVisualization} changeView={() => this.setState({ onEditor: false })} /> :
          <Explorer changeView={() => this.setState({ onEditor: true })} />
        }
      </div>
    );
  }
}
