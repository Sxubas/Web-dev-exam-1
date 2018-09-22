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

  buildVisualization(spec, data){
    let vis = {};
    vis.spec = spec;
    vis.data = data;
    this.setState({
      exploredVisualization: vis,
      onEditor: true
    });
  }

  render() {
    return (
      <div className='app'>

        <div className='banner-container'>
          <h1>Minimalistic Vega Visualization</h1>
          <button onClick={() => this.setState({ onEditor: !this.state.onEditor })} className='explore-button'>
            {this.state.onEditor ? 'Explore more visualizations' : 'Return to editing visualizations'}
          </button>
        </div>

        {this.state.onEditor ?
          <Editor exploredVisualization={this.state.exploredVisualization} changeView={() => this.setState({ onEditor: false })} /> :
          <Explorer 
            changeView={() => this.setState({ onEditor: true })} 
            exploreVisualization={(spec, data) => this.buildVisualization(spec, data)}
          />
        }
      </div>
    );
  }
}
