'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');

class General extends React.Component
{
  render() {
    return(
      <PageCard icon="icon-newspaper" title="Bill Template" description="Define your headers and footers of your invoice" />
    )
  }
}

module.exports = General;
