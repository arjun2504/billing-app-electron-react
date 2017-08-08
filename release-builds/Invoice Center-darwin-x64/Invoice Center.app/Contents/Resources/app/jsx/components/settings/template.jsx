'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');
var $ = require('jquery');
var api = localStorage.getItem('api');
var InvoiceTemplate = require('../InvoiceTemplate.jsx');

Array.prototype.removeValue = function(index){
   var array = $.map(this, function(v,i){
      return i === index ? null : v;
   });
   this.length = 0; //clear original array
   this.push.apply(this, array); //push all elements except the one we want to delete
}

class Template extends React.Component
{
  constructor(props) {
    super(props);

    this.handleAddHeader = this.handleAddHeader.bind(this);
    this.handleAddFooter = this.handleAddFooter.bind(this);
    this.handleRemoveFooter = this.handleRemoveFooter.bind(this);
    this.handleRemoveCustom = this.handleRemoveCustom.bind(this);
    this.getOption = this.getOption.bind(this);
    this.getCustomText = this.getCustomText.bind(this);
    this.getHF = this.getHF.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleAddCustom = this.handleAddCustom.bind(this);
    this.handleChangeCustom = this.handleChangeCustom.bind(this);
    this.handleCustomSave = this.handleCustomSave.bind(this);
    this.handleHFSave = this.handleHFSave.bind(this);

    this.state = {
      headers: [],
      footers: [],
      options: [],
      custom: [],
      showTemplate: true
    };
    this.getHF();
    // this.state.headers.push(this.getBlankData());
    // this.state.footers.push(this.getBlankData());
    this.getCustomText();
    this.getOption();
  }

  getHF() {
    fetch(api + 'option/hf/get').then((response) => {
      return response.json();
    }).then((json) => {
      this.state.headers = JSON.parse(json.header);
      this.state.footers = JSON.parse(json.footer);
      this.forceUpdate();
    })
  }

  refreshTemplate() {
    this.setState({ showTemplate: false });
    this.forceUpdate();
    this.setState({ showTemplate: true });
    this.forceUpdate();
  }

  getCustomText() {
    fetch(api + 'option/custom-text/get').then((response) => {
      return response.json();
    }).then((json) => {
      this.state.custom = json.custom_text;
    }).then(() => {
      this.forceUpdate();
    });
  }

  getOption() {
    fetch(api + 'option/template').then((response) => {
      return response.json();
    }).then((json) => {
      this.state.options = [];
      for(var k in json) {
        if(json.hasOwnProperty(k)) {
          this.state.options.push({
            key: k,
            val: json[k]
          })
        }
      }
    }).then(() => {
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
    this.state.custom.push("");
    this.forceUpdate();
  }

  handleRemoveFooter(ix) {
    this.state.footers.splice(ix, 1);
    this.forceUpdate();
  }

  handleRemoveHeader(ix) {
    this.state.headers.splice(ix, 1);
    this.forceUpdate();
  }

  handleRemoveCustom(ix) {
    this.state.custom.splice(ix, 1);
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

  handleChangeCustom(e, i) {
    this.state.custom[i] = e.target.value;
    console.log(this.state.custom);
    this.forceUpdate();
  }

  handleCustomSave() {
    fetch(api + 'option/custom-text/save', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'custom_text': this.state.custom })
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if(json.status == 'success') {
        alert('Custom Text Saved');
        this.getOption();
      }
    })
  }

  handleHFSave() {
    fetch(api + 'option/hf/save', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'header': this.state.headers, 'footer': this.state.footers })
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if(json.status == 'success')
        alert('Headers and footers successfully saved!');
        this.refreshTemplate();
    })
  }

  render() {
    return(
      <div>
      <PageCard icon="icon-newspaper" title="Invoice Template" description="Define headers and footers of invoice" />
      <div className="template-form pull-left sample-invoice">
        <h3 className="settings-category">Preview</h3>
        <div className="template-print-conv">
        { this.state.showTemplate &&
          <InvoiceTemplate sample={1} />
        }
        </div>
      </div>
      <div className="template-form pull-left">
        <h3 className="settings-category">Headers</h3>
        {
          this.state.headers.map(function(k,i) {
            var index = i;
            return (
              <div key={'header'+i}>
              <div className="form-group templ-drop">
              <select className="form-control" defaultValue={k.text} onChange={(e) => this.handleRowSelect(e,k)}>
                <option>---Select---</option>
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
              <div className="form-group templ-font">
                <button type="button" className="btn btn-negative" onClick={() => this.handleRemoveHeader(index)}>
                  <span className="icon icon-cancel"></span>
                </button>
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
              <select className="form-control" defaultValue={k.text} onChange={(e) => this.handleRowSelect(e,k)}>
                <option>---Select---</option>
                {
                  this.state.options.map(function(v,ix) {
                    return (
                      <option key={'opt-'+ix}  value={v.val}>{v.val}</option>
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
        <br/>
        <br/>
        <button type="button" className="btn btn-positive" onClick={this.handleHFSave}>
          <span className="icon icon-floppy icon-text"></span>
          Save
        </button>
        <div className="clearfix"></div>
        <br/>
        <hr/>
        <br/>
        <h3 className="settings-category">Custom Text</h3>
        {
          this.state.custom.map(function(k,i) {
            var index = i;
            return (
              <div key={'cus-' + i}>
                <div className="form-group templ-custom-txt">
                  <input type="text" className="form-control" value={k} placeholder={'Custom Text ' + (i+1)} onChange={(e) => this.handleChangeCustom(e,index)}/>
                </div>
                <div className="form-group templ-font">
                  <button type="button" className="btn btn-negative" onClick={() => this.handleRemoveCustom(index)}>
                    <span className="icon icon-cancel"></span>
                  </button>
                </div>
              </div>
            )
          }.bind(this))
        }
        <div className="clearfix"></div>
        <button type="button" className="btn btn-primary" onClick={this.handleAddCustom}>
          <span className="icon icon-plus-circled icon-text"></span>
          Add Custom Text
        </button>
        <br/>
        <br/>
        <button type="button" className="btn btn-positive" onClick={this.handleCustomSave}>
          <span className="icon icon-floppy icon-text"></span>
          Save
        </button>
      </div>
      </div>
    )
  }
}

module.exports = Template;
