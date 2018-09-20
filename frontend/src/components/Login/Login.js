import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <div className='login-container'>
        
        <h1>Exam Test</h1>

        <div id="vis"></div>

      </div>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func
};

export default Login;
