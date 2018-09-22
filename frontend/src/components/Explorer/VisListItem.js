import React, { Component } from 'react';
import pt from 'prop-types';
import Visualization from './../Visualization';
import './VisListItem.css';

class VisListItem extends Component {

  constructor(props) {
    super(props);

    //Easier to manage udate when sent to server
    this.state = {
      ratingScore: props.rating ? props.rating / props.votes : null,
      rating: false,
      alreadyRated: false,
      ratingMessage: '',
      name: ''
    };

    //If 0/0
    if (isNaN(this.state.ratingScore)) {
      //Do not force a renderq
      this.state.ratingScore = 'Not rated yet';
    }
  }

  rateVisualization() {
    const rating = parseInt(this.ratingSelect.value);

    if (!this.state.name) {
      this.setState({ ratingMessage: 'In order to rate, you should register a name' });
    }
    else {
      fetch('/visualizations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating,
          id: this.props._id,
          name: this.state.name
        })
      }).then(res => res.json()).then(json => {
        if (json.errorMessage) {
          this.setState({ ratingMessage: json.errorMessage });
        }
        else {
          this.setState({
            ratingScore: json.rating,
            ratingMessage: 'Vote registered successfully!',
            alreadyRated: true //Restrict 'multiple' votes on session
          });
        }
      });
    }

  }

  displayRating() {
    if (this.state.ratingScore) {
      return this.state.ratingScore.toString().substring(0, 4);
    }
    else {
      const displayedRating = this.props.rating / this.props.votes;

      return (isNaN(displayedRating) ? 'Not rated yet' : displayedRating);
    }
  }

  render() {
    return (
      <div>
        <div className='list-item-header'>
          <h3>{this.props.name}</h3>
          <span>
            {this.displayRating()} ⭐
            <button className='explore-button' onClick={() => this.setState({ rating: !this.state.rating })}>
              {this.state.rating ? 'Collapse rating form' : 'Rate this visualization'}
            </button>
            <button className='explore-button' onClick={() => this.props.exploreVisualization(this.props.spec, this.props.data)}>
              Edit this visualization
            </button>
          </span>
        </div>
        {this.state.rating ?
          <div className='rating-container'>
            <div className='rating-form-name-container'>
              Rater name
              <input type="text" onChange={event => this.setState({ name: event.target.value })} value={this.state.name} />

            </div>
            <select ref={ref => this.ratingSelect = ref}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <button
              onClick={() => this.rateVisualization()}
              disabled={this.state.alreadyRated}>
              Send rating
            </button>
            {this.state.ratingMessage ?
              <div className={this.state.ratingMessage === 'Vote registered successfully!' ? 'successful-rating-message' : 'error-rating-message'}>
                {this.state.ratingMessage}
              </div>
              : null}
          </div>
          : null}

        <Visualization
          spec={this.props.spec}
          data={this.props.data}
          index={this.props.index} />
      </div>
    )
  }
}

VisListItem.propTypes = {
  name: pt.string,
  spec: pt.object,
  data: pt.array,
  index: pt.number,
  rating: pt.number,
  _id: pt.string,
  votes: pt.number,
  exploreVisualization: pt.func
};

export default VisListItem;
