'use strict'

var React = require('react');
var QrCode = require('qrcode.react');
//var api = require('electron').remote.getGlobal('sharedObj').api;
var api = localStorage.getItem('api');
var classNames = require('classnames');

class InvoiceTemplate extends React.Component
{
  constructor(props) {
    super(props);

    this.state = {
      invoice: {},
      products: [],
      options: {},
      headers: [],
      footers: []
    };
    this.getInvoice = this.getInvoice.bind(this);
    this.getProducts = this.getProducts.bind(this);
    //this.getOptions = this.getOptions.bind(this);
    this.getTotalTaxCalc = this.getTotalTaxCalc.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    this.getInvoiceForQr = this.getInvoiceForQr.bind(this);
    this.getHF = this.getHF.bind(this);
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

  componentDidMount() {
    if(this.props.sample == 1) {
      var now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      this.state.invoice = {
        'id': 100,
        'total': 1358,
        'total_gst': 1357.55,
        'sale': 1234,
        'created_at': this.getDateTime(now),
        'checked': false
      };
      this.state.products = [
          	{
          		"id": 1,
          		"product_code": "123",
          		"product_name": "Saree",
          		"meter": 1,
          		"quantity": 2,
          		"rate": 300,
          		"amount_gst": 630,
          		"amount": 600,
          		"invoice_id": 22,
          		"created_at": now,
          		"updated_at": now,
          		"sgst": 2.5,
          		"cgst": 2.5
          	},
            {
          		"id": 2,
          		"product_code": "456",
          		"product_name": "T-Shirt",
          		"meter": 1,
          		"quantity": 2,
          		"rate": 300,
          		"amount_gst": 630,
          		"amount": 600,
          		"invoice_id": 22,
          		"created_at": now,
          		"updated_at": now,
          		"sgst": 2.5,
          		"cgst": 2.5
          	}
          ];
    } else {
      if(this.props.print == 1 && this.props.currentInvoice !== 'undefined') {
        this.getInvoice(this.props.currentInvoice.bid);
      }
      else
        this.getInvoice(this.props.invoice);
    }
    this.getInvoiceForQr();
    this.getHF();
  }

  getInvoiceForQr() {
    var str = "Invoice Id: " + this.state.invoice.id + "\n";
    this.state.products.map(function(k,i) {
      str += "--------------------------------\n"
      str += "Product #" + (i+1) + "\n";
      str += "--------------------------------\n"
      str += "Product Code: " + k.product_code + "\n";
      str += "Product Name: " + k.product_name + "\n";
      str += "Mts.: " + k.meter + "\n";
      str += "Qty.: " + k.quantity + "\n";
      str += "Rate: " + k.rate + "\n";
      str += "CGST: " + k.cgst + "%\n";
      str += "SGST: " + k.sgst + "%\n";
      str += "Amount Excl. Tax: " + k.amount + "\n";
      str += "Amount Incl. Tax: " + k.amount_gst + "\n";
      str += "--------------------------------\n"
    });
    return str;
  }

  // saveInvoice(invoice) {
  //   fetch(api + "invoice/save", {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(invoice)
  //   }).then( (response) => {
  //     return response.json()
  //   }).then( (json) => {
  //     this.getInvoice(this.props.currentInvoice.bid);
  //   });
  // }

  getInvoice(id) {
    fetch(api + "invoice/id/" + id).then((response) => {
      return response.json();
    }).then((json) => {
      this.state.invoices = [];
      if(json.data) {
        json.data.map(function(v,i) {
          this.state.invoice = {
            'id': v.id,
            'total': v.total,
            'total_gst': v.total,
            'sale': v.sale,
            'created_at': this.getDateTime(v.created_at),
            'checked': false
          };
        }.bind(this));
      }
      this.getProducts();
    });
  }

  getDateTime(datetime) {
    var t = datetime.split(/[- :]/);
    var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
    return d.toLocaleDateString("en-US", {
        year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit"
      });
  }

  handlePrint() {
    var content = document.getElementById("printcontents");
    var pri = document.getElementById("ifmcontentstoprint").contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  }

  getProducts() {
    var products = [];
    return fetch(api + 'invoice/products/' + this.state.invoice.id).then((response) => {
      return response.json();
    }).then((json) => {
      //this.getOptions();
      this.state.products = json;
      console.log(JSON.stringify(json));
      this.getTotalTaxCalc();
      this.forceUpdate();
      if(this.props.print == 1)
        window.print();
    });
  }

  getOptions() {
    fetch(api + 'option/all').then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({ options: json });
      this.forceUpdate();
      localStorage.setItem('state', JSON.stringify(this.state));
    });
  }

  getTotalTaxCalc() {
    var sale1 = 0;
    var sale2 = 0;
    var saleStr1 = "";
    var saleStr2 = "";
    var tax1 = 0, tax2 = 0;
    var tax3 = 0, tax4 = 0;
    this.state.products.map(function(k,i) {
      if(k.rate >= 1000) {
        sale1 += k.amount;
        tax1 = k.cgst;
        tax2 = k.sgst;
      }
      if (k.rate < 1000){
        sale2 += k.amount;
        tax3 = k.cgst;
        tax4 = k.sgst;
      }
    });
    if(sale1 != 0)
      saleStr1 = "SALE: " + parseFloat(sale1).toFixed(2) + " CGST: " + tax1 + "% " + parseFloat((tax1 / 100) * sale1).toFixed(2) + " SGST: " + tax2 + "% " + parseFloat((tax2 / 100) * sale1).toFixed(2);
    if(sale2 != 0)
      saleStr2 = "SALE: " + parseFloat(sale2).toFixed(2) + " CGST: " + tax3 + "% " + parseFloat((tax3 / 100) * sale2).toFixed(2) + " SGST: " + tax4 + "% " + parseFloat((tax4 / 100) * sale2).toFixed(2);

    if(sale1 != 0 && sale2 != 0)
      return (
        <span>
        {saleStr1} <br/> {saleStr2}
        </span>
      )
    else if(sale1 != 0 && sale2 == 0)
      return saleStr1
    else if(sale1 == 0 && sale2 != 0)
      return saleStr2
  }

  render() {
    var invoicePageClass = classNames({
      'invoice-page': true,
      'hide': this.props.invisible == "1"
    });
    return(
      <div>
      <div className={invoicePageClass} id="printcontents">
        <header>
        <div className="pull-left footer-section-sm">

        </div>
        <div className="pull-left footer-section-lg break-css">
          {
            this.state.headers.map(function(k,i) {
              var size = {
                fontSize: k.size + 'px'
              };
              return(
                <div key={'header-'+i} style={size}>{k.text}</div>
              )
            })
          }
          </div>
          <div className="pull-left date-time-bill">{this.state.invoice.created_at}</div>
        </header>
        <section>
          <table>
            <thead>
              <tr>
                <th className="invoice-product-code">Code</th>
                <th className="invoice-product-name">Name</th>
                <th className="invoice-product-code">Mts.</th>
                <th className="invoice-product-code">Qty.</th>
                <th>Rate</th>
                <th>Amt.</th>
              </tr>
            </thead>

              {
                this.state.products.map(function(v,i) {
                  return(
                    <tbody key={'row-'+v.id}>
                    <tr>
                      <td className="invoice-product-code">{v.product_code}</td>
                      <td className="invoice-product-name">{v.product_name}</td>
                      <td className="invoice-product-code">{v.meter == null && <span>-</span>}</td>
                      <td className="invoice-product-code">{v.quantity}</td>
                      <td>{parseFloat(v.rate).toFixed(2)}</td>
                      <td>{parseFloat(v.amount_gst).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="right-align" colSpan="6">SALE: {v.amount} CGST: {v.cgst}% {parseFloat((v.cgst / 100) * v.amount).toFixed(2)} SGST: {v.cgst}% {parseFloat((v.sgst / 100) * v.amount).toFixed(2)}</td>
                    </tr>
                    </tbody>
                  )
                }.bind(this))
              }

            <tfoot>
              <tr>
                <td className="right-align" colSpan="5">
                Total
                </td>
                <td>{parseFloat(this.state.invoice.total_gst).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="left-align" colSpan="6">{this.getTotalTaxCalc()}</td>
              </tr>
            </tfoot>
          </table>
          <div className="grand-total-section">
            GRAND TOTAL: {parseFloat(this.state.invoice.total).toFixed(2)}
          </div>
        </section>
        <footer>
          <div className="pull-left footer-section-sm">
            <QrCode value={this.state.invoice.id+""} size={40} />
          </div>
          <div className="pull-left footer-section-lg break-css">
            <div className="center-align">
            {
              this.state.footers.map(function(k,i) {
                var size = {
                  fontSize: k.size + 'px'
                }
                return(
                  <div key={'footer-'+i} style={size}>{k.text}</div>
                )
              })
            }
            Invoice No.: {this.state.invoice.id}<br/>
            </div>
          </div>
          <div className="clearfix"></div>
        </footer>
      </div>
      { this.props.print != 1 &&
      <center>
      <button type="button" className="btn btn-default btn-large print-templ-btn bill-btn" onClick={() => window.print()}>
        <span className="icon icon-print icon-text"></span>
          Print
        </button>
      </center>
      }
      </div>
    )
  }
}

module.exports = InvoiceTemplate;
