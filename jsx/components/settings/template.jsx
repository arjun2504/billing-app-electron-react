'use strict'

var React = require('react');

class Template extends React.Component
{
  render() {
    return(
      <div className="content-area">

        <div className="icon-area pull-left">
          <span className="icon icon-cog"></span>
        </div>

        <div className="content-title pull-left">
          <h2>Bill Template</h2>
          <p>Description goes here</p>
        </div>

        <div className="divider"></div>

      </div>
    )
  }
}

module.exports = Template;
