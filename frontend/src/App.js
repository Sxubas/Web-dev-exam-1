import React, { Component } from 'react';
import './App.css';
import vegaEmbed from 'vega-embed';

class App extends Component {

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

    this.state = {
      spec: defaultSpec,
      visText: JSON.stringify(defaultSpec, null, 2),
      parseError: null,
      specError: null
    };
  }

  componentDidMount(){
    this.updateVisualization();
    window.onresize = () => {
      this.updateVisualization();
    };
  }

  componentDidUpdate(){
    this.updateVisualization();
  }

  updateVisualization() {

    var myDbta = [
      { 'a': 'A', 'b': 28 }, { 'a': 'B', 'b': 55 }, { 'a': 'C', 'b': 43 },
      { 'a': 'D', 'b': 91 }, { 'a': 'E', 'b': 81 }, { 'a': 'F', 'b': 53 },
      { 'a': 'G', 'b': 19 }, { 'a': 'H', 'b': 87 }, { 'a': 'I', 'b': 52 }
    ];

    const embed_opt = { 
      'mode': 'vega-lite',
      height: this.visContainer.clientHeight,
      width: Math.min(this.visContainer.clientWidth, (window.innerWidth - 44)* 0.5)
    };

    console.log(embed_opt);

    if(this.state.specError) return;

    vegaEmbed(this.div, this.state.spec, embed_opt)
      .catch(error => this.setState({ specError: error.message}))
      .then((res) => {
        res.view.insert('myData', myDbta).run();
      });

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

  render() {

    return (
      <div className='app'>
        <h1>Minimalistic vega visualization</h1>
        <div className='container'>
          <div className='left-container'>
            <h2>Insert your visulization config (spec):</h2>

            {this.state.parseError ? <span className='error-message'>Error parsing json: {this.state.parseError}</span> : null}
            {this.state.specError ? <span className='error-message'>Spec error: {this.state.specError}</span> : null}
            <textarea onChange={event => this.handleInput(event) } value={this.state.visText} wrap='off'/>
            
            <button className='text-area-button left-text-button' onClick={() => this.setState({visText: JSON.stringify(this.state.spec, null, 2)})}>Prettify</button>

            <h2>Select your data:</h2>
          </div>
          <div className='vertical-hr' />
          <div className='right-container' ref={ref => this.visContainer = ref}>
            <h2>Here is your visualization:</h2>

            <div className='visualization' ref={div => this.div = div}>
              {/*Vega visualization*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
