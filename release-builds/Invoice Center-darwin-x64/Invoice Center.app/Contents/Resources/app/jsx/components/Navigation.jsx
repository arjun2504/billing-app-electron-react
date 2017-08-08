'use strict'

var React = require('react');

class Header extends React.Component
{
  render() {
    return(
      <header className="toolbar toolbar-header">
      <div className="toolbar-actions toolbar-actions-custom">
        <div className="filter-controls">
          <input type="text" className="form-control" placeholder="Invoice #" />
        </div>


        <button className="btn btn-default">
          <span className="icon icon-trash icon-text"></span>
          Clear All
        </button>

        <button className="btn btn-default btn-dropdown pull-right">
          <span className="icon icon-megaphone"></span>
        </button>
      </div>
    </header>
    )
  }
}

module.exports = Header;
