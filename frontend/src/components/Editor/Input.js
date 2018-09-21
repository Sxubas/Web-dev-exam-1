import React, { Component } from 'react';
import Papa from 'papaparse';
import PT from 'prop-types';
import './Input.css';

class Input extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submittingName: false,
      name: ''
    };
  }

  handleCSV() {
    const file = this.fileChooser.files[0];

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        this.props.updateCSV(results.data);
      },
      error(error) {
        console.log(error);
      }
    });
  }

  render() {
    return (
      <div className='left-container'>
        <h2>Insert your visulization config (spec):</h2>

        {this.props.parseError ? <span className='error-message'>Error parsing json: {this.props.parseError}</span> : null}
        {this.props.specError ? <span className='error-message'>Spec error: {this.props.specError}</span> : null}

        <textarea onChange={event => this.props.handleInput(event)} value={this.props.visText} wrap='off' />

        <div className='aux-buttons-container'>
          <button className='text-area-button left-text-button' onClick={this.props.prettify}>Prettify</button>
          <button className='text-area-button' onClick={this.props.restoreVisualization}>Clear</button>
          <button className='text-area-button right-text-button' onClick={() => this.setState({ submittingName: !this.state.submittingName })}>
            {this.state.submittingName ? 'Cancel publishing' : 'Publish visualization'}
          </button>
        </div>

        {this.state.submittingName ?
          <div className='name-form'>
            <span>Publisher&#39;s name:</span>
            <input type="text" onChange={event => this.setState({ name: event.target.value })} value={this.state.name} />
            <span className={this.props.uploadMessage === 'Vis uploaded successfully!' || this.props.uploadMessage === 'Uploading...' ?
              'successful-upload' : 'error-message'}>
              {this.props.uploadMessage && this.props.uploadMessage}
            </span>
            <button
              onClick={() => this.props.publishVisualization(this.state.name)}
              disabled={this.props.uploadMessage === 'Uploading...'}
            >
              Submit visualization
            </button>
          </div>
          : null
        }

        <h2>Select your data:</h2>

        <div>
          <input type="file" onChange={() => this.handleCSV()} ref={ref => this.fileChooser = ref} />
        </div>

      </div>
    )
  }
}

Input.propTypes = {
  visText: PT.string,
  prettify: PT.func,
  publishVisualization: PT.func,
  restoreVisualization: PT.func,
  handleInput: PT.func,
  updateCSV: PT.func,
  parseError: PT.string,
  specError: PT.string,
  uploadMessage: PT.string
};

export default Input;
