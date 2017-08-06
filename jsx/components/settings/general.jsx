'use strict'

var React = require('react');
var classNames = require('classnames');
var PageCard = require('../PageCard.jsx');
var api = localStorage.getItem('api');
class General extends React.Component
{
  constructor(props) {
      super(props);
      this.getOptions = this.getOptions.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSave = this.handleSave.bind(this);
      this.state = {
        'options': {}
      };
  }

  getOptions() {
    fetch(api + 'option/all').then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({ 'options': json });
    })
  }

  componentDidMount() {
    this.getOptions();
  }

  handleChange(e) {
    for(var key in this.state.options) {
      if(this.state.options.hasOwnProperty(key)) {
        if(e.target.name == key) {
          this.state.options[key] = e.target.value;
          break;
        }
      }
    }
    this.forceUpdate();

  }

  handleSave(e) {
    console.log(this.state.options);
    fetch(api + 'option/save',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.options)
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if(json.status == 'success')
        alert("Successfully Saved.");
      else
        alert("Error Saving Settings.");
    })
  }

  render() {
    return(
      <div className="content-area">
        <PageCard icon="icon-cog" title="General Settings" description="Manage your general settings" />
        <div className="template-form pull-left">
          <h2 className="settings-category">Basic</h2>
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" onChange={this.handleChange} value={this.state.options.company_name} name="company_name" className="form-control" placeholder="Enter Company Name"/>
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea onChange={this.handleChange} value={this.state.options.address} className="form-control" name="address" rows="3">{this.state.options.address}</textarea>
          </div>
          <h2 className="settings-category">Tax</h2>
          <div className="form-group">
            <label>SGST for products greater than or equal to ₹1000</label>
            <input type="number" onChange={this.handleChange} value={this.state.options.sgst_ge_1000} name="sgst_ge_1000" className="form-control" placeholder="Enter a floating point value"/>
          </div>
          <div className="form-group">
            <label>SGST for products less than ₹1000</label>
            <input type="number" onChange={this.handleChange} value={this.state.options.sgst_lt_1000} name="sgst_lt_1000" className="form-control" placeholder="Enter a floating point value"/>
          </div>
          <div className="form-group">
            <label>CGST for products greater than or equal to ₹1000</label>
            <input type="number" onChange={this.handleChange} value={this.state.options.cgst_ge_1000} name="cgst_ge_1000" className="form-control" placeholder="Enter a floating point value"/>
          </div>
          <div className="form-group">
            <label>CGST for products less than ₹1000</label>
            <input type="number" onChange={this.handleChange} value={this.state.options.cgst_lt_1000} name="cgst_lt_1000" className="form-control" placeholder="Enter a floating point value"/>
          </div>
        </div>
        <div className="template-form pull-right">
          <h2 className="settings-category">Business Meta</h2>
          <div className="form-group">
            <label>TIN #</label>
            <input type="text" onChange={this.handleChange} value={this.state.options.tin} name="tin" className="form-control" placeholder="Enter TIN #"/>
          </div>
          <div className="form-group">
            <label>GSTIN #</label>
            <input type="text" onChange={this.handleChange} value={this.state.options.gstin} name="gstin" className="form-control" placeholder="Enter GSTIN #"/>
          </div>
        </div>
        <div className="clearfix"></div>
        <center>
          <button type="button" className="btn btn-primary btn-large" onClick={this.handleSave}>
          <span className="icon icon-floppy icon-text"></span>
          Save
          </button>
        </center>
      </div>
    )
  }
}

module.exports = General;
