'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');

class General extends React.Component
{
  render() {
    return(
      <PageCard icon="icon-cog" title="General Settings" description="Manage your general settings" />
    )
  }
}

module.exports = General;
