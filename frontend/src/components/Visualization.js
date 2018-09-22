import React, { Component } from 'react';
import pt from 'prop-types';
import vegaEmbed from 'vega-embed';
import './Visualization.css';

class Visualization extends Component {


  updateVisualization() {
    //Do not update if there is a known error, as this would cause infinite setState calls
    if (this.props.specError) return;

    if (this.visContainer) {
      const embed_opt = {
        'mode': 'vega-lite',
        height: window.innerHeight - 80 /*this.visContainer.clientHeight*/,
        width: Math.max(this.visContainer.clientWidth - 44, (window.innerWidth - 44) * 0.5)
      };

      vegaEmbed(this.div, this.props.spec, embed_opt)
        .catch(error => this.props.onSpecError(error))
        .then((res) => {
          res.view.insert('myData', this.props.data).run();
        });
    }

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

  render() {
    return (
      <div className='right-container' ref={ref => this.visContainer = ref}>
        <div className='visualization' ref={div => this.div = div}>
          {/*Vega visualization*/}
        </div>
      </div>
    )
  }
}

Visualization.propTypes = {
  spec: pt.object,
  data: pt.array,
  specError: pt.string,
  onSpecError: pt.func
};

export default Visualization;
