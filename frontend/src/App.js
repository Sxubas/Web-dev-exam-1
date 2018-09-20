import React, { Component } from 'react';
import './App.css';
import vegaEmbed from 'vega-embed';

class App extends Component {

  constructor() {
    super();
    this.state = {
      visJson:{},
      visText: `{
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "description": "A simple bar chart with embedded data.",
        "data": {
          "name": "myData"
        },
        "mark": "bar",
        "encoding": {
          "y": { "field": "a", "type": "ordinal" },
          "x": { "field": "b", "type": "quantitative" }
        }
      }`,
      error: null
    };
  }

  updateVisualization(event) {

    if(!event) return; //Nothing has changed 

    const input = event.target.value;

    var myData = [
      { "a": "A", "b": 28 }, { "a": "B", "b": 55 }, { "a": "C", "b": 43 },
      { "a": "D", "b": 91 }, { "a": "E", "b": 81 }, { "a": "F", "b": 53 },
      { "a": "G", "b": 19 }, { "a": "H", "b": 87 }, { "a": "I", "b": 52 }
    ];

    try{
    const spec = JSON.parse(input);

    const embed_opt = { "mode": "vega-lite" };
    const view = vegaEmbed(this.div, spec, embed_opt)
      .catch(error => console.log('Error: ', error))
      .then((res) => {
        res.view.insert("myData", myData).run();
        this.setState({visJson: spec, visText: event.target.value});
      });
    }
    catch (error){
      this.setState({error: error.message});
    }
  }


  render() {

    this.updateVisualization();

    return (
      <div className="App">
        <h1>Minimalistic vega visualization</h1>
        <div className='container'>
          <div>

            <h2>Insert your json visulization:</h2>


            {this.state.error ? <span>{this.state.error}</span> : null }

            <textarea rows="20" cols="80" onChange={event => {this.updateVisualization(event)}} value={this.state.visText}/>

            <h2>Select your data:</h2>
          </div>
          <div>
            <h2>Here is your visualization:</h2>

            <div ref={div => this.div = div}>
              {/*Vega visualization*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
