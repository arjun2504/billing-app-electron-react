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
    /*
    {
      'bill_num': 1,
      'product': []
    }
    */
  }

  ComponentDidMount() {
    console.log(this.state.active_invoice);
  }

  handleNewInvoice(e) {
    e.preventDefault();
    var blankInvoice = this.getBlankInvoice();
    blankInvoice.bid = this.state.next_bid;
    this.state.invoices.push(blankInvoice);
    this.setState({ 'next_bid': (this.state.next_bid + 1), 'active_invoice': blankInvoice.bid });
    console.log(this.state.invoices);

    localStorage.setItem('state', JSON.stringify(this.state));
  }

  handleCloseInvoice(billno) {
    this.state.invoices.removeValue('bid', billno);
    console.log(this.state.invoices);
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  handleActiveInvoice(billno) {
    this.setState({'active_invoice': billno});
    console.log(billno, this.state.active_invoice);
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
                    <div className={tabClass} id={'bill-' + v.bid} name={'bill-' + v.bid} onClick={() => { this.handleActiveInvoice(v.bid) }}>
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
              <tr>
                <th>#</th>
                <th>Code</th>
                <th>Name</th>
                <th>Meters</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>1</td>
                <td><input type="number" className="form-control"/></td>
                <td>Windows</td>
                <td><input type="number" className="form-control"/></td>
                <td><input type="number" className="form-control"/></td>
                <td><input type="number" className="form-control"/></td>
                <td>60</td>
              </tr>
            </table>
          </div>
          <div className="total-content"></div>
        </div>
    </div>
    )
  }
}

module.exports = Invoice;
