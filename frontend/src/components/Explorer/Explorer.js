import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisListItem from './VisListItem';
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
          <VisListItem
            key={element._id}
            index={index}
            data={element.data}
            spec={element.spec}
            name={element.name}
            rating={element.rating}
            votes={element.votes}
            _id={element._id}
          />
        )}
      </div>
    );
  }
}

Explorer.propTypes = {
  changeView: PropTypes.func
}

export default Explorer;
