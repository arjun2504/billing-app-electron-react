'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');
var Navigation = require('../Navigation.jsx');

class About extends React.Component
{
  render() {
    return(
      <div className="content-area">
        <PageCard icon="icon-ccw" title="Invoice History" description="View all your invoice history up to date" />
        <Navigation />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice #</th>
              <th>Invoiced at</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>12</td>
              <td>Jul 21</td>
              <td>8000</td>
              <td className="history-controls">
                <button className="btn btn-primary">
                  <span className="icon icon-docs icon-text"></span>
                  Make a Copy
                </button>
              </td>
              <td className="history-controls">
                <button className="btn btn-negative">
                  <span className="icon icon-trash icon-text"></span>
                  Clear
                </button>
              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>12</td>
              <td>Jul 21</td>
              <td>8000</td>
              <td className="history-controls">
                <button className="btn btn-primary">
                  <span className="icon icon-docs icon-text"></span>
                  Make a Copy
                </button>
              </td>
              <td className="history-controls">
                <button className="btn btn-negative">
                  <span className="icon icon-trash icon-text"></span>
                  Clear
                </button>
              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>12</td>
              <td>Jul 21</td>
              <td>8000</td>
              <td className="history-controls">
                <button className="btn btn-primary">
                  <span className="icon icon-docs icon-text"></span>
                  Make a Copy
                </button>
              </td>
              <td className="history-controls">
                <button className="btn btn-negative">
                  <span className="icon icon-trash icon-text"></span>
                  Clear
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

module.exports = About;
