'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');
var classNames = require('classnames');
var $ = require('jquery');
//var api = require('electron').remote.getGlobal('sharedObj').api;
var api = localStorage.getItem('api');
var Select = require('react-select');
//var pcodes = [];
var AnimatedNumber = require('react-animated-number');
var InvoiceTemplate = require('../InvoiceTemplate.jsx');
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
  getNextInvoiceId() {
    fetch(api + "invoice/next").then((response) => {
      return response.json();
    }).then((json) => {
      var nextId = json.next;
      //console.log(nextId);
      this.state.active_invoice = nextId;
      this.state.next_bid = nextId + 1;
      this.state.invoices.push(this.getBlankInvoice(nextId));
      this.saveToLocal();
      this.forceUpdate();
    }).catch((err) => { console.log(err) });
  }

  getBlankInvoice(bid = null) {
      return (
        {
          'bid': bid,
          'products': [
            {
              'product_code': '',
              'product_name': '',
              'rate': '',
              'meters': '',
              'quantity': '',
              'amount': 0,
              'amount_gst': 0,
              'cgst': 0,
              'sgst': 0
            }
          ],
          'saved': false,
          'total': 0,
          'total_gst': 0,
          'total_roff': 0
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
            'amount': 0,
            'amount_gst': 0,
            'cgst': 0,
            'sgst': 0
          }
        )
  }

  constructor(props) {
    super(props);

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
    this.getProductAmount = this.getProductAmount.bind(this);
    this.getInvoiceTotal = this.getInvoiceTotal.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.getCurrentInvoice = this.getCurrentInvoice.bind(this);
    this.getNextInvoiceId = this.getNextInvoiceId.bind(this);
    this.changeInvoiceSavedStatus = this.changeInvoiceSavedStatus.bind(this);
    this.getCgst = this.getCgst.bind(this);
    this.getSgst = this.getSgst.bind(this);
    this.saveToLocal = this.saveToLocal.bind(this);
    //this.renderPrint = this.renderPrint.bind(this);

    if(localStorage.getItem('state') == null) {

      this.state = {
        'fetched_products': [],
        'activeTabLock': false,
        //'active_invoice': -1,
        //'next_bid': 2,
        'invoices': [],
        'pcodes_only': [],
        'db_next_id': 0,
        'options': {},
        'currentPrint': -1
      };
      this.getNextInvoiceId();

    } else {
      this.state = JSON.parse(localStorage.getItem('state'));
    }
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchOptions() {
    fetch(api + 'option/all').then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({ options: json });
      this.forceUpdate();
      this.saveToLocal();
    });
  }

  fetchProducts() {
    fetch(api + "stock/all?stock=1").then((response) => { return response.json() }).then((json) => {
      this.setState({ 'fetched_products': json }, () => {
        this.forceUpdate();
        var pcodes = [];
        this.state.fetched_products.map(function(k,i) {
          pcodes.push({ 'value': k.product_code, 'label': k.product_name });
        });
        this.setState({'pcodes_only': pcodes}, () => {
          this.forceUpdate();
          this.saveToLocal();
        });
      });
    }).then(() => {
      this.fetchOptions();
    });
  }

  handleNewInvoice(e) {
    e.preventDefault();
    var blankInvoice = this.getBlankInvoice(this.state.next_bid);
    this.state.invoices.push(blankInvoice);
    this.setState({ 'next_bid': (this.state.next_bid + 1), 'active_invoice': blankInvoice.bid }, () => {
      this.saveToLocal();
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
          //console.log(nextActive);
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
      this.state.currentPrint = -1;
      this.setState({ 'active_invoice': billno }, () => {
        this.forceUpdate();
        this.saveToLocal();
      });
    }
  }

  handleRow(e) {
    this.state.currentPrint = -1;
    var val = e.target.value;
    var name = e.target.name.split('-');
    var key = name[0];
    var index = name[1];
    var active_invoice = parseInt(this.state.active_invoice);
    this.changeInvoiceSavedStatus(false);
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
              pk.cgst = this.getCgst(pk.rate);
              pk.sgst = this.getSgst(pk.rate);
            }
        }.bind(this));
      }
    }.bind(this));
    this.forceUpdate();
    this.saveToLocal();
  }

  handleNewRow() {
    var active_invoice = this.state.active_invoice;
    this.state.currentPrint = -1;
    this.state.invoices.map(function(k,v) {
      if(k.bid == active_invoice) {
        k.products.push(this.getBlankProduct());
      }
    }.bind(this));
    this.forceUpdate();
    this.saveToLocal();
  }

  handleRemoveRow(index) {
    var active_invoice = this.state.active_invoice;
    //this.state.currentPrint = -1;
    this.state.invoices.map(function(k,v) {
      if(k.bid == active_invoice)
        return k.products.splice(index,1);
    });
    this.forceUpdate();
    this.saveToLocal();
  }

  saveToLocal() {
    var printrem = this.state;
    printrem.currentPrint = -1;
    localStorage.setItem('state', JSON.stringify(printrem));
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
    this.forceUpdate();
    return codes;
  }

  handleSelectCode() {

  }

  handleSetProduct(val, pk) {
    pk.product_name = val.label;
    pk.product_code = val.value;
    this.state.fetched_products.map(function(v,i) {
      if(v.product_code == pk.product_code) {
        pk.rate = v.price;
      }
    });
    this.forceUpdate();
    this.saveToLocal();
  }

  getCgst(rate) {
    return ((rate >= 1000) ? parseFloat(this.state.options.cgst_ge_1000) : parseFloat(this.state.options.cgst_lt_1000));
  }

  getSgst(rate) {
    return ((rate >= 1000) ? parseFloat(this.state.options.sgst_ge_1000) : parseFloat(this.state.options.sgst_lt_1000));
  }

  getProductAmount(pk) {
    var total = 0, total_gst = 0;
    var meters = ((pk.meters+"").trim() == "") ? 1 : pk.meters;
    total = meters * pk.quantity * pk.rate;
    total_gst = ( ( ( ( pk.cgst + pk.sgst ) / 100 ) * total ) + total);
    pk.amount = total;
    pk.amount_gst = total_gst;
    return total_gst;
  }

  getInvoiceTotal(type = null) {
    var invoiceTotal = 0;
    var invoiceTotalGst = 0;
    var roundOff = 0;
    this.state.invoices.map(function(v,i) {
      if(v.bid == this.state.active_invoice) {
        v.total_gst = 0;
        v.products.map(function(kv,ki) {
          if(kv.amount != 0) {
            invoiceTotal += kv.amount;
            v.total = invoiceTotal;
            //v.total_gst = ( ( ( ( kv.cgst + kv.sgst ) / 100 ) * invoiceTotal ) + invoiceTotal );
            v.total_gst += kv.amount_gst;
            invoiceTotalGst = v.total_gst;
            v.total_roff = Math.round(v.total_gst);
            roundOff = v.total_roff;
          }
        }.bind(this));
      }
    }.bind(this));
    if(type == 'round')
      return roundOff;
    else if(type == 'gst')
      return invoiceTotalGst;
    else {
      return invoiceTotal;
    }
  }

  getCurrentInvoice() {
    var current_invoice;
    this.state.invoices.map(function(v,i) {
      if(v.bid == this.state.active_invoice) {
        current_invoice = v;
      }
    }.bind(this));
    return current_invoice;
  }

  handleSave(print = null) {
    var invoice = this.getCurrentInvoice();
    fetch(api + "invoice/save", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoice)
    }).then( (response) => {
      return response.json()
    }).then( (json) => {
      if(json.status == "success") {
        if(print == 'print') {
          console.log(this.state.currentPrint, this.state.active_invoice)
          if(this.state.currentPrint != this.state.active_invoice) {
            this.setState({ 'currentPrint': -1 }, () => {
              this.forceUpdate();
              this.setState({ 'currentPrint': invoice.bid }, () => {
                this.forceUpdate();
              });
            });
          }
          else {
            this.setState({ 'currentPrint': invoice.bid }, () => {
              this.forceUpdate();
            });
          }

        } else {
          alert("Saved Successfully");
        }
        this.changeInvoiceSavedStatus(true);
      } else {
        alert("Error while saving invoice!");
      }
    });
  }

  changeInvoiceSavedStatus(status) {
    this.state.invoices.map(function(v,i) {
      if(v.bid == this.state.active_invoice) {
        v.saved = status;
      }
    }.bind(this));
    this.forceUpdate();
    this.saveToLocal();
  }

  render() {
    var dragStyle ={
      'WebkitAppRegion': 'drag'
    };
    return(
      <div>
      <div className="content-area">
        <PageCard icon="icon-basket" title="Create Invoice" description="Add products that are being purchased and create invoice" />
        {
          this.state.invoices.length > 0 &&
          <div className="tab-group" id="my-tab-group-1">
              {
                this.state.invoices.map(function(v,i) {
                    var tabClass = classNames({
                      'tab-item': true,
                      'active': this.state.active_invoice === v.bid
                    });
                    var saved = (v.saved == true) ? "" : "*";
                    return (
                      <div className={tabClass} key={'tab-' + v.bid} id={'bill-' + v.bid} name={'bill-' + v.bid} onClick={() => { this.handleActiveInvoice(v.bid) }}>
                        <span className="icon icon-close-tab" onClick={() => { this.handleCloseInvoice(v.bid) }}></span>
                        {saved + 'Invoice #' + v.bid}
                      </div>
                    )
                }.bind(this))
              }
              <div className="tab-item tab-item-fixed btn btn-add-tab" onClick={this.handleNewInvoice}></div>
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
    {
      this.state.invoices.length > 0 &&
      <div className="table-area">
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
                <th>Amount ₹</th>
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
                    var total = this.getProductAmount(pk);
                    return(
                      <tr>
                        <td>{iterate}</td>
                        <td>{pk.product_code}</td>
                        <td>
                          <Select
                              name={'pcode-' + iterate}
                              options={this.state.pcodes_only}
                              clearable={false}
                              onChange={(value) => { this.handleSetProduct(value, pk)}}
                              placeholder=""
                              value={pk.product_code}
                          />
                        </td>
                        <td><input type="number" className="form-control" name={'meters-' + iterate} value={pk.meters} onChange={this.handleRow}/></td>
                        <td><input type="number" className="form-control" name={'quantity-' + iterate} value={pk.quantity} onChange={this.handleRow}/></td>
                        <td><input type="number" className="form-control" name={'rate-' + iterate} value={pk.rate} onChange={this.handleRow} onKeyDown={(e) => { this.handleTabPress(e, pv, i) }} /></td>
                        <td className="text-right-align">
                        <AnimatedNumber component="text" value={total}
                              style={{
                                  transition: '0.8s ease-out',
                                  transitionProperty:
                                      'background-color, color, opacity'
                              }}

                              duration={200}
                              formatValue={(n) => { return parseFloat(n).toFixed(2); }}/>
                        </td>
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

      </div>

      </div>
    }
    <div className="total-content pull-right">
        <table className="total-table">
          <tbody>
            <tr>
              <td className="total-sm">
                <span>Sale:</span><br/>
                <span>CGST (%) + SGST (%):</span><br/>
                <span>Total Amount: </span>
              </td>
              <td className="total-sm">
                <span>₹ <AnimatedNumber component="text" value={this.getInvoiceTotal()} style={{ transition: '0.8s ease-out', transitionProperty: 'background-color, color, opacity'}} duration={200} formatValue={(n) => { return parseFloat(n).toFixed(2); }} /></span>
                <br/><span>₹ {parseFloat(this.getInvoiceTotal('gst') - this.getInvoiceTotal()).toFixed(2)}</span><br/>
                <span>₹ <AnimatedNumber component="text" value={this.getInvoiceTotal('gst')} style={{ transition: '0.8s ease-out', transitionProperty: 'background-color, color, opacity'}} duration={200} formatValue={(n) => { return parseFloat(n).toFixed(2); }} /></span>
              </td>
              <td className="total-lg">
                <span>₹ <AnimatedNumber component="text" value={this.getInvoiceTotal('round')} style={{ transition: '0.8s ease-out', transitionProperty: 'background-color, color, opacity' }} duration={200} formatValue={(n) => { return parseFloat(n).toFixed(2); }} /></span>
              </td>
              <td>
                <button type="button" className="btn btn-large btn-default bill-btn" onClick={this.handleSave}>
                  <span className="icon icon-check"></span> Save
                </button><br/>
                <button type="button" className="btn btn-large btn-default bill-btn" onClick={ () => { this.handleSave('print') }}>
                  <span className="icon icon-print icon-text"></span>
                  Print
                </button>
                {
                  this.state.active_invoice == this.state.currentPrint &&
                    <InvoiceTemplate invoice={this.state.currentPrint} invisible="1" print={1} currentInvoice={this.getCurrentInvoice()} />
                }
              </td>
            </tr>
            </tbody>
        </table>
      <span className="total-lg"></span>
    </div>
    </div>
    )
  }


  // renderPrint(bid) {
  //   return(
  //
  //   )
  // }

}

module.exports = Invoice;
