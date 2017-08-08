'use strict'

var React = require('react');

class PageCard extends React.Component
{
  render() {
    return(
      <div className="page-card">
        <div className="icon-area pull-left">
          <span className={'icon ' + this.props.icon}></span>
        </div>

        <div className="content-title pull-left">
          <h2>{this.props.title}</h2>
          <p>{this.props.description}</p>
        </div>

        <div className="divider"></div>
      </div>
    )
  }
}

module.exports = PageCard;
