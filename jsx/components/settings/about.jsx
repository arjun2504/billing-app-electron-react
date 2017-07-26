'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');

class About extends React.Component
{
  render() {
    return(
      <div className="content-area">
        <PageCard icon="icon-info" title="About" description="Written for JRK & Sons" />
      </div>
    )
  }
}

module.exports = About;
