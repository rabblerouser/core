import React, {Component} from 'react';
import ReactDOM from 'react-dom';

const Button = props => (
  <button disabled={props.disabled} type={props.type} id={props.id} onClick={props.onClick}>
    {props.textContent}
  </button>
);

Button.propTypes = {
  disabled: React.PropTypes.bool,
  textContent: React.PropTypes.string,
  type: React.PropTypes.string,
  id: React.PropTypes.string,
  onClick: React.PropTypes.func
};

export default Button;
