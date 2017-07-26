'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');

class Invoice extends React.Component
{
  render() {
    return(
      <div className="content-area">
        <PageCard icon="icon-basket" title="Create Invoice" description="Add products that are being purchased and create invoice" />
      </div>
    )
  }
}

module.exports = Invoice;
