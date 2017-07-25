'use strict'

var React = require('react');

class Welcome extends React.Component
{
  render() {
    return(
      <div className="noselectmenu">
        <h2>Select an item from the menu to view</h2>
      </div>
    )
  }
}

module.exports = Welcome;
