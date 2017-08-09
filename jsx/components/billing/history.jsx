'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');
var DatePicker = require('react-datepicker').default;
var moment = require('moment');
//var api = require('electron').remote.getGlobal('sharedObj').api;
var api = localStorage.getItem('api');
var classNames = require('classnames');
var InvoiceTemplate = require('../InvoiceTemplate.jsx');

class History extends React.Component
{
  constructor(props) {
      super(props);
      this.state = {
        startDate: null,
        endDate: null,
        currentInvoice: null,
        invoices: [],
        pagination: {
          current_page: null,
          next_page: null,
          prev_page: null
        },
        search_invoice_id: '',
        api_slug: 'invoice/all'
      };
      this.handleDate = this.handleDate.bind(this);
      this.getInvoices = this.getInvoices.bind(this);
      this.handleInvoiceSearch = this.handleInvoiceSearch.bind(this);
      this.handleInvoiceId = this.handleInvoiceId.bind(this);
      this.handleShowAll = this.handleShowAll.bind(this);
      this.handleChecked = this.handleChecked.bind(this);
      this.handleFilterByDate = this.handleFilterByDate.bind(this);
      this.showDelete = this.showDelete.bind(this);
      this.handleDeleteInvoices = this.handleDeleteInvoices.bind(this);
      this.getCurrentInvoiceProducts = this.getCurrentInvoiceProducts.bind(this);
      this.getCurrentInvoice = this.getCurrentInvoice.bind(this);
  }

  componentDidMount() {
    this.getInvoices();
  }

  getInvoices(page = 1) {
    var append = (page != 1) ? "?page=" + page : "";
    fetch(api + this.state.api_slug + append).then((response) => {
      return response.json();
    }).then((json) => {
      this.state.invoices = [];
      if(json.data) {
        json.data.map(function(v,i) {
          this.state.invoices.push({
            'id': v.id,
            'total': v.total,
            'total_gst': v.total,
            'day_seq': v.day_seq,
            'sale': v.sale,
            'created_at': this.getDateTime(v.created_at),
            'checked': false
          });
        }.bind(this));
      }
      var next_page = null;
      var prev_page = null;
      if(json.current_page) {
        next_page = (json.next_page_url) ? json.current_page + 1 : null;
        prev_page = (json.prev_page_url) ? json.current_page - 1 : null;
      }
      this.state.pagination = (json.current_page) ? { 'current_page': json.current_page, 'next_page': next_page, 'prev_page': prev_page } : {};
      this.forceUpdate();
    });
    document.getElementById('main-check').checked = false;
  }

  handleDate(date, type) {
    (type == 'start') ? this.setState({ startDate: date}) : this.setState({ endDate: date})
  }

  handleInvoiceId(e) {
    var value = e.target.value;
    this.setState({ search_invoice_id: value });
  }

  handleInvoiceSearch() {
    var invoice_id = this.state.search_invoice_id;
    if(invoice_id.trim() != '') {
      this.setState({
        api_slug: 'invoice/id/' + invoice_id,
        startDate: null,
        endDate: null
      }, () => {
        this.forceUpdate();
        this.getInvoices();
      });
    }
  }

  handleShowAll() {
    this.setState({ api_slug: 'invoice/all', search_invoice_id: '', startDate: '', endDate: '' },() => {
      this.getInvoices();
    });
  }

  handleChecked(e, id = null) {
    var allcheckflag = 0;
    this.state.invoices.map(function(v,i) {
      if(id != null && v.id == id)
        v.checked = (v.checked === true) ? false : true;
      else if(id == null && e.target.checked == true)
        v.checked = true;
      else if(id == null && e.target.checked == false)
        v.checked = false;
      if(v.checked == false) {
        allcheckflag = 1;
      }
    })
    if(id != null && e.target.checked == false) {
      document.getElementById('main-check').checked = false;
    }
    if(allcheckflag == 0) {
      document.getElementById('main-check').checked = true;
    }
    this.forceUpdate();
  }

  getDateTime(datetime) {
    var t = datetime.split(/[- :]/);
    var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
    return d.toLocaleDateString("en-US", {
        year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit"
      });
  }

  handleFilterByDate() {
    if(this.state.startDate != '' && this.state.endDate != '') {
      var from = this.state.startDate.format("DD-MM-YYYY");
      var to = this.state.endDate.format("DD-MM-YYYY");
      this.setState({ api_slug: 'invoice/range/' + from + '/' + to, search_invoice_id: '' }, () => {
        this.getInvoices();
      });
    }
  }

  showDelete() {
    var visible = false;
    this.state.invoices.map(function(v,i) {
      if(v.checked == true)
        visible = true;
    });
    return !visible;
  }

  handleSelectRow(id) {
    this.setState({ currentInvoice: id });
  }

  handleDeleteInvoices() {
    var checked = [];
    this.state.invoices.map(function(v,i) {
      if(v.checked == true) {
        checked.push(v.id);
      }
    });

    var conf = confirm('Are you sure that you want to delete selected invoices?');
    if(conf) {
      fetch(api + 'invoice/delete', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'items': checked })
      }).then((response) => {
        return response.json();
      }).then((json) => {
        if(json.status == 'success') {
          console.log(json.status);
          var current_page = null;
          if(this.state.pagination !== 'undefined')
            current_page = this.state.pagination.current_page;
          this.getInvoices(current_page);
          alert("Selected Invoices Successfully Deleted.");
        }
      });
    }
  }

  getCurrentInvoiceProducts(id) {
    var products = [];
    return fetch(api + 'invoice/products/' + id).then((response) => {
      return response.json();
    }).then((json) => {
      return json;
    });

  }

  getCurrentInvoice() {
    var invoice = null;
    this.state.invoices.map(function(k, i) {
      if(this.state.currentInvoice == k.id) {
        invoice = k;
      }
    }.bind(this));
    return invoice;
  }

  render() {
    return(
      <div>
      <div className="content-area">
        <PageCard icon="icon-ccw" title="Invoice History" description="View all your invoice history up to date" />
        <div className="history-area">
          <header className="toolbar toolbar-header">
            <div className="toolbar-actions toolbar-actions-custom">

              <div className={classNames({ 'btn-container': true, 'pull-left': true, 'invisible': this.showDelete()})}>
                <button type="submit" className="btn btn-default" onClick={this.handleDeleteInvoices}>
                  <span className="icon icon-trash"></span>
                </button>
              </div>

              <div className={classNames({ 'btn-container': true, 'pull-left': true, 'invisible': this.state.api_slug == 'invoice/all'})}>
              <button type="submit" className="btn btn-default" onClick={this.handleShowAll}>
                Show All
              </button>
              </div>


                <div className="filter-controls pull-left">
                  <input type="text" value={this.state.search_invoice_id} onChange={this.handleInvoiceId} name="invoice_id" className="form-control" placeholder="Invoice #" />
                  <button type="button" className="btn btn-default" onClick={this.handleInvoiceSearch}>
                    <span className="icon icon-search"></span>
                  </button>
                </div>




              <div className="pagination">
                {
                  this.state.pagination.prev_page == null &&
                  <button className="btn btn-default" disabled>
                    <span className="icon icon-left-open"></span>
                  </button>
                }
                {
                  this.state.pagination.prev_page != null &&
                  <button className="btn btn-primary" onClick={() => { this.getInvoices(this.state.pagination.prev_page) }}>
                    <span className="icon icon-left-open"></span>
                  </button>
                }
                {
                  this.state.pagination.next_page != null &&
                  <button className="btn btn-primary" onClick={() => { this.getInvoices(this.state.pagination.next_page) }}>
                    <span className="icon icon-right-open"></span>
                  </button>
                }
                {
                  this.state.pagination.next_page == null &&
                  <button className="btn btn-default" disabled>
                    <span className="icon icon-right-open"></span>
                  </button>
                }
              </div>

              <div className="date-range-picker">
                <DatePicker selected={this.state.startDate} dateFormat="DD/MM/YYYY" onChange={(date) => { this.handleDate(date, 'start') }} className="form-control" placeholderText="Start date..." />
                <span className="or-text"> to </span>
                <DatePicker selected={this.state.endDate} dateFormat="DD/MM/YYYY" onChange={(date) => { this.handleDate(date, 'end') }} className="form-control" placeholderText="End date..." />
                &nbsp;
                <button className="btn btn-default" onClick={this.handleFilterByDate}>
                  <span className="icon icon-search"></span>
                </button>
              </div>

            </div>
          </header>
          <div className="table-area">
            <table className="table table-striped history-table">
              <thead>
                <tr>
                  <th><input type="checkbox" id="main-check" onChange={this.handleChecked} defaultChecked={false} /></th>
                  <th>#</th>
                  <th>Day Seq.</th>
                  <th>Total</th>
                  <th>Created at</th>
                </tr>
              </thead>
              <tbody>
              {
                this.state.invoices.map(function(v,i) {
                  let checked;
                  if(v.checked == true)
                    checked = "checked";
                  var classnames = classNames({
                    'highlight-row': v.id === this.state.currentInvoice
                  });
                  return(
                    <tr className={classnames} key={'row-'+v.id} onClick={() => this.handleSelectRow(v.id)}>
                      <td><input type="checkbox" value={v.id} checked={checked} onClick={(e) => { this.handleChecked(e, v.id) }} defaultChecked={false} /></td>
                      <td>{v.id}</td>
                      <td>{v.day_seq}</td>
                      <td>{v.total}</td>
                      <td>{v.created_at}</td>
                    </tr>
                  )
                }.bind(this))
              }
              </tbody>
            </table>
          </div>
        </div>
        <div className="bill-area">
          {
            this.state.invoices.map(function(k,i) {
              if(this.state.currentInvoice == k.id) {
                return(
                  <div key={'tp-'+k.id}>
                    <InvoiceTemplate invoice={k.id} />
                  </div>
                )
              }
            }.bind(this))
          }
        </div>
      </div>
      </div>
    )
  }
}

module.exports = History;
