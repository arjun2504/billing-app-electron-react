'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');
var $ = require('jquery');
var api = localStorage.getItem('api');

Array.prototype.removeValue = function(index){
   var array = $.map(this, function(v,i){
      return i === index ? null : v;
   });
   this.length = 0; //clear original array
   this.push.apply(this, array); //push all elements except the one we want to delete
}

class General extends React.Component
{
  constructor(props) {
    super(props);

    this.handleAddHeader = this.handleAddHeader.bind(this);
    this.handleAddFooter = this.handleAddFooter.bind(this);
    this.handleRemoveFooter = this.handleRemoveFooter.bind(this);
    this.getOption = this.getOption.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleAddCustom = this.handleAddCustom.bind(this);

    this.state = {
      headers: [],
      footers: [],
      options: [],
      custom: [{
        value: ''
      }]
    };

    this.state.headers.push(this.getBlankData());
    this.state.footers.push(this.getBlankData());
    this.getOption();
  }

  getOption() {
    fetch(api + 'option/all').then((response) => {
      return response.json();
    }).then((json) => {
      for(var k in json) {
        if(json.hasOwnProperty(k)) {
          this.state.options.push({
            key: k,
            val: json[k]
          })
        }
      }
    }).then(() => {
      console.log(this.state.options);
      this.forceUpdate();
    });
  }

  getBlankData() {
    return ({
      text: '',
      size: 9
    })
  }

  handleAddHeader() {
    this.state.headers.push(this.getBlankData());
    this.forceUpdate();
  }

  handleAddFooter() {
    this.state.footers.push(this.getBlankData());
    this.forceUpdate();
  }

  handleAddCustom() {
    this.state.custom.push({ value: '' });
    this.forceUpdate();
  }

  handleRemoveFooter(ix) {
    console.log(this.state.footers[ix]);
    this.state.footers.splice(ix, 1);
    this.forceUpdate();
  }

  handleRowSelect(e, k) {
    k.text = e.target.value;
    this.forceUpdate();
  }

  handleSizeChange(e, k) {
    k.size = e.target.value;
    this.forceUpdate();
  }

  render() {
    return(
      <div>
      <PageCard icon="icon-newspaper" title="Invoice Template" description="Define headers and footers of invoice" />
      <div className="template-form pull-left">
        <h3 className="settings-category">Invoice</h3>
      </div>
      <div className="template-form pull-left">
        <h3 className="settings-category">Headers</h3>
        {
          this.state.headers.map(function(k,i) {
            return (
              <div key={'header'+i}>
              <div className="form-group templ-drop">
              <select className="form-control" onChange={(e) => this.handleRowSelect(e,k)}>
                {
                  this.state.options.map(function(v,ix) {
                    return (
                      <option key={'opt-'+ix} value={v.val}>{v.val}</option>
                    )
                  }.bind(this))
                }
              </select>
              </div>
              <div className="form-group templ-font">
                <input type="number" className="form-control" placeholder="Size" value={k.size} onChange={(e) => this.handleSizeChange(e,k)}/>
              </div>
              <div className="clearfix"></div>
              </div>
            )
          }.bind(this))
        }
        <button type="button" className="btn btn-primary" onClick={this.handleAddHeader}>
          <span className="icon icon-plus-circled icon-text"></span>
          Add Header
        </button>
        <div className="clearfix"></div>
        <br/>
        <h3 className="settings-category">Footers</h3>
        {
          this.state.footers.map(function(k,i) {
            var index = i;
            return (
              <div key={'footer'+i}>
              <div className="form-group templ-drop">
              <select className="form-control" onChange={(e) => this.handleRowSelect(e,k)}>
                {
                  this.state.options.map(function(v,ix) {
                    return (
                      <option key={'opt-'+ix} value={v.val}>{v.val}</option>
                    )
                  }.bind(this))
                }
              </select>
              </div>
              <div className="form-group templ-font">
                <input type="number" className="form-control" placeholder="Size" value={k.size} onChange={(e) => this.handleSizeChange(e,k)} />
              </div>
              <div className="form-group templ-font">
                <button type="button" className="btn btn-negative" onClick={() => this.handleRemoveFooter(index)}>
                  <span className="icon icon-cancel"></span>
                </button>
              </div>
              <div className="clearfix"></div>
              </div>
            )
          }.bind(this))
        }
        <button type="button" className="btn btn-primary" onClick={this.handleAddFooter}>
          <span className="icon icon-plus-circled icon-text"></span>
          Add Footer
        </button>
        <div className="clearfix"></div>
        <br/>
        <h3 className="settings-category">Custom Text</h3>
        {
          this.state.custom.map(function(k,i) {
            return (
              <div className="form-group">
                <input type="text" className="form-control" value={k.value} placeholder={'Custom Text ' + (i+1)} />
              </div>
            )
          }.bind(this))
        }
        <button type="button" className="btn btn-primary" onClick={this.handleAddCustom}>
          <span className="icon icon-plus-circled icon-text"></span>
          Add Custom Text
        </button>
        <button type="button" className="btn btn-primary" onClick={this.handleRemoveCustom}>
          <span className="icon icon-plus-circled icon-text"></span>
          Add Custom Text
        </button>
      </div>
      </div>
    )
  }
}

module.exports = General;
