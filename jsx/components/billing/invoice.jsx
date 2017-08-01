'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');
var classNames = require('classnames');
var $ = require('jquery');
var api = require('electron').remote.getGlobal('sharedObj').api;
var Select = require('react-select');
var pcodes = [];
//require('react-select/dist/react-select.css');

Array.prototype.removeValue = function(name, value){
   var array = $.map(this, function(v,i){
      return v[name] === value ? null : v;
   });
   this.length = 0; //clear original array
   this.push.apply(this, array); //push all elements except the one we want to delete
}

Array.prototype.getObject = function(name, value) {
    return $.map(this, function(v,i) {
      if(v[name] === value)
      {
        return v;
      }
    });
}
// 0.875 * 5 * 100 = meters * quantity * rate = amount
class Invoice extends React.Component
{
  getBlankInvoice() {
      return (
        {
          'bid': 1,
          'products': [
            {
              'product_code': '',
              'product_name': '',
              'rate': '',
              'meters': '',
              'quantity': '',
              'amount': 0
            }
          ],
          'total': 0,
          'cst': 2.5,
          'gst': 2.5
        }
      )
  }

  getBlankProduct() {
      return(
          {
            'product_code': '',
            'product_name': '',
            'rate': '',
            'meters': '',
            'quantity': '',
            'amount': 0
          }
        )
  }

  constructor(props) {
    super(props);

    if(localStorage.getItem('state') == null) {
      this.state = {
        'fetched_products': [],
        'activeTabLock': false,
        'active_invoice': 1,
        'next_bid': 2,
        'invoices': [],
        'pcodes_only': [],
      };
      this.state.invoices.push(this.getBlankInvoice());
    } else {
      this.state = JSON.parse(localStorage.getItem('state'));
    }

    this.handleNewInvoice = this.handleNewInvoice.bind(this);
    this.handleCloseInvoice = this.handleCloseInvoice.bind(this);
    this.handleActiveInvoice = this.handleActiveInvoice.bind(this);
    this.handleRow = this.handleRow.bind(this);
    this.handleNewRow = this.handleNewRow.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);
    this.handleTabPress = this.handleTabPress.bind(this);
    this.fetchProducts = this.fetchProducts.bind(this);
    this.allProductCodes = this.allProductCodes.bind(this);
    this.handleSetProduct = this.handleSetProduct.bind(this);

    this.fetchProducts();
    pcodes = this.allProductCodes();
    /*
    {
      'bill_num': 1,
      'product': []
    }
    */
  }

  ComponentDidMount() {

  }

  fetchProducts() {
    fetch(api + "stock/all?stock=1").then((response) => { return response.json() }).then((json) => {
      this.setState({ 'fetched_products': json }, () => {
        this.setState({'pcodes_only':pcodes});
        localStorage.setItem('state', JSON.stringify(this.state));
      });
    });
  }

  handleNewInvoice(e) {
    e.preventDefault();
    var blankInvoice = this.getBlankInvoice();
    blankInvoice.bid = this.state.next_bid;
    this.state.invoices.push(blankInvoice);
    this.setState({ 'next_bid': (this.state.next_bid + 1), 'active_invoice': blankInvoice.bid }, () => {
      localStorage.setItem('state', JSON.stringify(this.state));
    });

  }

  handleCloseInvoice(billno) {
    //this.state.invoices.removeValue('bid', billno);
    //localStorage.setItem('state', JSON.stringify(this.state));
    // if(this.state.invoices[0]) {
    //   //this.handleActiveInvoice(this.state.invoices[0].bid);
    //   this.state.active_invoice = parseInt(this.state.invoices[0].bid);
    //   console.log("somethins is here" + this.state.invoices[0].bid);
    // } else {
    //   this.setState({'active_invoice': -1});
    //   console.log("its null");
    // }
    // this.forceUpdate();
    // localStorage.setItem('state', JSON.stringify(this.state));
    var nextActive = 0;
    var prev = 0;
    this.state.invoices.map(function(v,i) {
      if(v.bid == billno) {
        this.state.invoices.splice(i,1);
        nextActive = prev;
        if(nextActive == 0 && this.state.invoices[0])
          nextActive = this.state.invoices[0].bid;
        this.setState({ 'activeTabLock': true }, () => {
          this.setState({ 'active_invoice': nextActive });
          this.forceUpdate();
          console.log(nextActive);
          setTimeout(function() {
            this.setState({ 'activeTabLock': false });
            this.forceUpdate();
          }.bind(this),500);
        });
      }
      prev = v.bid;
    }.bind(this));
  }

  handleActiveInvoice(billno) {
    if(!this.state.activeTabLock) {
      this.setState({ 'active_invoice': billno }, () => {
        this.forceUpdate();
        localStorage.setItem('state', JSON.stringify(this.state));
      });
    }
  }

  handleRow(e) {
    var val = e.target.value;
    var name = e.target.name.split('-');
    var key = name[0];
    var index = name[1];
    var active_invoice = parseInt(this.state.active_invoice);
    this.state.invoices.map(function(k,v) {
      if(k.bid == active_invoice) {
          k.products.map(function(pk, pv) {
            if(pv == index-1) {
              switch(key) {
                case 'pcode':
                  pk.product_code = val;
                  break;
                case 'rate':
                  pk.rate = val;
                  break;
                case 'meters':
                  pk.meters = val;
                  break;
                case 'quantity':
                  pk.quantity = val;
                  break;
              }
            }
        });
      }
    });
    this.forceUpdate();
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  handleNewRow() {
    var active_invoice = this.state.active_invoice;
    this.state.invoices.map(function(k,v) {
      if(k.bid == active_invoice) {
        k.products.push(this.getBlankProduct());
      }
    }.bind(this));
    this.forceUpdate();
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  handleRemoveRow(index) {
    var active_invoice = this.state.active_invoice;
    this.state.invoices.map(function(k,v) {
      if(k.bid == active_invoice)
        return k.products.splice(index,1);
    });
    this.forceUpdate();
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  handleTabPress(e, productIndex, invoiceIndex) {
    if(!e.shiftKey && e.keyCode == 9 && this.state.invoices[invoiceIndex].products.length-1 == productIndex) {
      this.handleNewRow();
    }
  }

  allProductCodes() {
    var codes = [];
    this.state.fetched_products.map(function(k,i) {
      codes.push({ 'value': k.product_code, 'label': k.product_name });
    });
    return codes;
  }
  handleSelectCode() {

  }

  handleSetProduct(val, productIndex, invoiceIndex) {
    this.state.invoices[invoiceIndex].products[productIndex].product_name = val.label;
    this.state.invoices[invoiceIndex].products[productIndex].product_code = val.value;
    this.forceUpdate();
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  render() {
    var dragStyle ={
      'WebkitAppRegion': 'drag'
    };
    return(
      <div className="content-area">
        <PageCard icon="icon-basket" title="Create Invoice" description="Add products that are being purchased and create invoice" />
        {
          this.state.invoices.length > 0 &&
          <div>
          <div className="tab-group" id="my-tab-group-1">
              {
                this.state.invoices.map(function(v,i) {
                    var tabClass = classNames({
                      'tab-item': true,
                      'active': this.state.active_invoice === v.bid
                    });

                    return (
                      <div className={tabClass} key={'tab-' + v.bid} id={'bill-' + v.bid} name={'bill-' + v.bid} onClick={() => { this.handleActiveInvoice(v.bid) }}>
                        <span className="icon icon-close-tab" onClick={() => { this.handleCloseInvoice(v.bid) }}></span>
                        {'Invoice #' + v.bid}
                      </div>
                    )
                }.bind(this))
              }
              <div className="tab-item tab-item-fixed btn btn-add-tab" onClick={this.handleNewInvoice}></div>
          </div>
          <div id="tab-panel">
            <div className="tab-content" name="bill-1">
              <table className="table-striped custom-invoice-pane">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Meters</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {
                  this.state.invoices.map(function(v, i) {
                    if(v.bid == this.state.active_invoice) {
                      var iterate = 0;
                      return v.products.map(function(pk, pv) {
                        iterate++;
                        var total = pk.meters * pk.quantity * pk.rate;
                        return(
                          <tr>
                            <td>{iterate}</td>
                            <td>{pk.product_code}</td>
                            <td>
                              <Select
                                  name={'pcode-' + iterate}
                                  options={this.state.pcodes_only}
                                  clearable={false}
                                  onChange={(value) => { this.handleSetProduct(value,pv,i)}}
                                  placeholder=""
                                  value={pk.product_code}
                              />
                            </td>
                            <td><input type="number" className="form-control" name={'meters-' + iterate} value={pk.meters} onChange={this.handleRow}/></td>
                            <td><input type="number" className="form-control" name={'quantity-' + iterate} value={pk.quantity} onChange={this.handleRow}/></td>
                            <td><input type="number" className="form-control" name={'rate-' + iterate} value={pk.rate} onChange={this.handleRow} onKeyDown={(e) => { this.handleTabPress(e, pv, i) }} /></td>
                            <td>{total}</td>
                            <td className="removerow"><span className="icon icon-cancel-circled" onClick={ () => { this.handleRemoveRow(pv) } }></span></td>
                          </tr>
                        )
                      }.bind(this))
                    }
                  }.bind(this))
                }
                <tr className="addnewrow">
                  <td colSpan="8">
                    <button className="transparent-btn" onClick={this.handleNewRow}><span className="icon icon-plus"></span> Add New Row</button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div className="total-content"></div>
          </div>
          </div>
        }
        {
          this.state.invoices.length == 0 &&
          <div className="empty-invoice-container">
            <img src="./img/invoice.png" className="center-empty-icon" />
            <h1>Invoice Center</h1>
            <p>You do not have any active invoices.</p>
            <button type="button" className="btn btn-large btn-positive" onClick={this.handleNewInvoice}>Create Invoice</button>
          </div>
        }
    </div>
    )
  }
}

module.exports = Invoice;
