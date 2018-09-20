import React, { Component } from 'react';
import './App.css';
import vegaEmbed from 'vega-embed';
import Papa from 'papaparse';

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

    var defaultData = [
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
      data: defaultData
    };

  }

  componentDidMount() {
    this.updateVisualization();
    window.onresize = () => {
      this.updateVisualization();
    };
  }

  componentDidUpdate() {
    this.updateVisualization();
  }

  updateVisualization() {


    const embed_opt = {
      'mode': 'vega-lite',
      height: this.visContainer.clientHeight,
      width: Math.min(this.visContainer.clientWidth, (window.innerWidth - 44) * 0.5)
    };

    console.log(embed_opt);

    if (this.state.specError) return;

    vegaEmbed(this.div, this.state.spec, embed_opt)
      .catch(error => this.setState({ specError: error.message }))
      .then((res) => {
        res.view.insert('myData', this.state.data).run();
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

  handleCSV(){
    const file = this.fileChooser.files[0];

    Papa.parse(file, {
      header: true,
      complete : (results) => {
        this.setState({data: results.data});
      },
      error(error){
        console.log(error);
      }
    });

    /* const fileReader = new FileReader();

    fileReader.onload = () => {
      console.log(fileReader.result);
      console.log(typeof(fileReader.result));
    }; */
  }

  render() {

    return (
      <div className='app'>
        <h1>Minimalistic Vega Visualization</h1>
        <div className='container'>
          <div className='left-container'>
            <h2>Insert your visulization config (spec):</h2>

            {this.state.parseError ? <span className='error-message'>Error parsing json: {this.state.parseError}</span> : null}
            {this.state.specError ? <span className='error-message'>Spec error: {this.state.specError}</span> : null}
            <textarea onChange={event => this.handleInput(event)} value={this.state.visText} wrap='off' />
            <div className='aux-buttons-container'>


              <button className='text-area-button left-text-button' onClick={() => this.setState({ visText: JSON.stringify(this.state.spec, null, 2) })}>Prettify</button>
              <button className='text-area-button' onClick={() => this.setState({
                visText: '{"$schema": "https://vega.github.io/schema/vega-lite/v2.json"}', spec: { '$schema': 'https://vega.github.io/schema/vega-lite/v2.json' }
              })}>Clear</button>
              <button className='text-area-button right-text-button' onClick={() => console.log('Shared!')}>Publish visualization</button>              

            </div>

            <h2>Select your data:</h2>

            <div>
              <input type="file" onChange={(event) => this.handleCSV(event)} ref={ref => this.fileChooser = ref}/>
            </div>
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
