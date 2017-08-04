'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');
var DatePicker = require('react-datepicker').default;
var moment = require('moment');

class History extends React.Component
{
  constructor(props) {
      super(props);
      this.state = {
        startDate: '',
        endDate: '',
      };
      this.handleDate = this.handleDate.bind(this);
  }

  handleDate(date, type) {
    (type == 'start') ? this.setState({ startDate: date}) : this.setState({ endDate: date})
  }

  render() {
    return(
      <div>
      <div className="content-area">
        <PageCard icon="icon-ccw" title="Invoice History" description="View all your invoice history up to date" />
        <div className="history-area">
          <header className="toolbar toolbar-header">
            <div className="toolbar-actions toolbar-actions-custom">
              <div className="filter-controls">
                <input type="text" className="form-control" placeholder="Invoice #" />
              </div>
              <button className="btn btn-default">
                <span className="icon icon-search icon-text"></span>
                Show
              </button>
              <div className="date-range-picker">
                <DatePicker selected={this.state.startDate} dateFormat="DD/MM/YYYY" onChange={(date) => { this.handleDate(date, 'start') }} className="form-control" placeholderText="Start date..." />
                <span className="or-text"> to </span>
                <DatePicker selected={this.state.endDate} dateFormat="DD/MM/YYYY" onChange={(date) => { this.handleDate(date, 'end') }} className="form-control" placeholderText="End date..." />
                &nbsp;
                <button className="btn btn-default">
                  <span className="icon icon-search icon-text"></span>
                  Show
                </button>
              </div>

            </div>
          </header>
          <div className="table-area">
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
        </div>
      </div>
      </div>
    )
  }
}

module.exports = History;
