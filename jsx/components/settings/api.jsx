'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');

class About extends React.Component
{
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.state = (localStorage.getItem('api') != null) ? { 'default': localStorage.getItem('api') } : { 'default': 'http://localhost/jrk-api/public/api/' };

  }

  handleChange(e) {
    this.setState({
      'default': e.target.value
    })
  }

  handleSave(e) {
    e.preventDefault();
    localStorage.setItem('api',this.state.default);
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
        </div>
        </div>
      </div>
    )
  }
}

module.exports = About;
