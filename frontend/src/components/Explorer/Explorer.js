import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Visualization from './../Visualization';
import './Explorer.css';

class Explorer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visualizations: []
    };
  }

  componentDidMount() {
    fetch('/visualizations').then(res => res.json()).then(json => this.setState({ visualizations: json }));
  }

  render() {
    return (
      <div className='explore-container'>
        <h2>Visualization explorer</h2>
        <div>
          --------Filters--------
        </div>
        {this.state.visualizations.map((element, index) =>
          <div key={'' + element.name + element.date}>
            <h3>{element.name} - {element.rating} ⭐</h3>
            <Visualization
              spec={element.spec}
              data={element.data}
              index={index} />
          </div>
        )}
      </div>
    );
  }
}

Explorer.propTypes = {
  changeView: PropTypes.func
}

export default Explorer;
