'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');
var classNames = require('classnames');
var $ = require('jquery');

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
              'quantity': ''
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
            'quantity': ''
          }
        )
  }

  constructor(props) {
    super(props);

    if(localStorage.getItem('state') == null) {
      this.state = {
        'active_invoice': 1,
        'next_bid': 2,
        'invoices': []
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
    /*
    {
      'bill_num': 1,
      'product': []
    }
    */
  }

  ComponentDidMount() {

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
    this.state.invoices.removeValue('bid', billno);
    localStorage.setItem('state', JSON.stringify(this.state));
    if(this.state.invoices[0])
      this.handleActiveInvoice(this.state.invoices[0].bid);
    else
      this.setState({'active_invoice': -1}, () => {
          localStorage.setItem('state', JSON.stringify(this.state));
      });
  }

  handleActiveInvoice(billno) {
    this.setState({'active_invoice': billno}, () => {
        this.forceUpdate();
        localStorage.setItem('state', JSON.stringify(this.state));
    });
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

  render() {
    var dragStyle ={
      'WebkitAppRegion': 'drag'
    };
    return(
      <div className="content-area">
        <PageCard icon="icon-basket" title="Create Invoice" description="Add products that are being purchased and create invoice" />
        <div className="tab-group" id="my-tab-group-1">
            {
              this.state.invoices.map(function(v,i) {
                  var tabClass = classNames({
                    'tab-item': true,
                    'active': this.state.active_invoice === v.bid
                  });

                  return (
                    <div className={tabClass} key={'tab-' + v.bid} id={'bill-' + v.bid} name={'bill-' + v.bid} onClick={() => { this.handleActiveInvoice(v.bid) }}>
                      <span className="icon icon-close-tab" onClick={() => this.handleCloseInvoice(v.bid) }></span>
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
                      return(
                        <tr>
                          <td>{iterate}</td>
                          <td>
                            <input type="number" className="form-control" name={'pcode-' + iterate} value={pk.product_code} onChange={this.handleRow} />
                          </td>
                          <td>{pk.product_name}</td>
                          <td><input type="number" className="form-control" name={'rate-' + iterate} value={pk.rate} onChange={this.handleRow}/></td>
                          <td><input type="number" className="form-control" name={'meters-' + iterate} value={pk.meters} onChange={this.handleRow}/></td>
                          <td><input type="number" className="form-control" name={'quantity-' + iterate} value={pk.quantity} onChange={this.handleRow} /></td>
                          <td>60</td>
                          <td className="removerow"><span className="icon icon-cancel-circled" onClick={ () => { this.handleRemoveRow(pv) } }></span></td>
                        </tr>
                      )
                    }.bind(this))
                  }
                }.bind(this))
              }
              <tr className="addnewrow" onClick={this.handleNewRow}>
                <td colSpan="8"><span className="icon icon-plus"></span> Add New Row</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div className="total-content"></div>
        </div>
    </div>
    )
  }
}

module.exports = Invoice;
