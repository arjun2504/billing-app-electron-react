'use strict'

var React = require('react');

class Content extends React.Component
{
  render() {
    var Component = this.props.component;
    return(
      <Component/>
    )
  }
}

module.exports = Content;
