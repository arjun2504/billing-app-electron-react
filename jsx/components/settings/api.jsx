'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');
var classNames = require('classnames');

class About extends React.Component
{
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.getStatus = this.getStatus.bind(this);

    this.state = (localStorage.getItem('api') != null) ? { 'default': localStorage.getItem('api'), 'status': {} } : { 'default': 'http://localhost/jrk-api/public/api/', 'status': {} };
    this.getStatus();
  }

  handleChange(e) {
    this.setState({
      'default': e.target.value
    })
  }

  getStatus() {
    fetch(this.state.default + 'test').then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({ 'status': json })
    }).catch((err) => {
      var connection = {
        'connection': 'error',
        'database': 'error'
      }
      this.setState({ 'status': connection });
    });
  }

  handleSave(e) {
    e.preventDefault();
    localStorage.setItem('api',this.state.default);
    this.getStatus();
    alert("Saved. Please restart the app to see changes.");
  }

  render() {
    return(
      <div className="content-area">
        <PageCard icon="icon-code" title="API Location" description="Points to the API location from where you want to get billing data" />
        <div className="template-form pull-left">
        <h2 className="settings-category">API Locator</h2>
        <div className="api-page-cont pull-left">
          <div className="form-group">
            <label>API URL</label>
            <input type="text" className="form-control" value={this.state.default} onChange={this.handleChange} placeholder="Enter API URL Prefix..."/>
          </div>
          <button type="button" className="btn btn-large btn-primary" onClick={this.handleSave}>
            <span className="icon icon-floppy icon-text"></span>
            Save
          </button>
          <br/><br/>
          <h2 className="settings-category">Status</h2>
          {
            <div className="api-status">
            <p>API Status: <span className={classNames({ 'icon': true, 'icon-record':true, 'green-status': this.state.status.connection == 'success' })}></span> <span className="capitalize">{this.state.status.connection == 'success' && <span>Online</span>} {this.state.status.connection == 'error' && <span>Offline</span>}</span></p>
            <p>Database Status: <span className={classNames({ 'icon': true, 'icon-record':true, 'green-status': this.state.status.database == 'success' })}></span> <span className="capitalize">{this.state.status.database == 'success' && <span>Online</span>} {this.state.status.database == 'error' && <span>Offline</span>}</span></p>
            </div>
          }
        </div>
        </div>
      </div>
    )
  }
}

module.exports = About;
