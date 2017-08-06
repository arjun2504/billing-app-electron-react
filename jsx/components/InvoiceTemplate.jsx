'use strict'

var React = require('react');
var QrCode = require('qrcode.react');
var api = require('electron').remote.getGlobal('sharedObj').api;

class InvoiceTemplate extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      invoice: this.props.invoice,
      products: [],
      sgst: 2.5,
      cgst: 2.5
    };
    this.getProducts = this.getProducts.bind(this);
    this.getProducts();
  }

  getProducts() {
    var products = [];
    return fetch(api + 'invoice/products/' + this.state.invoice.id).then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({ products: json });
    });
  }

  render() {
    return(
      <div className="invoice-page">
        <header>
          <h2>JRK Textiles</h2>
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
                <th>Amount</th>
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
                      <td className="right-align" colSpan="6">SALE: {v.amount} CGST: {this.state.cgst}% {parseFloat((this.state.cgst / 100) * v.amount).toFixed(2)} SGST: {this.state.cgst}% {parseFloat((this.state.sgst / 100) * v.amount).toFixed(2)}</td>
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
                <td className="right-align" colSpan="5">SALE: {parseFloat(this.state.invoice.sale).toFixed(2)} CGST: {this.state.cgst}% {parseFloat((this.state.cgst / 100) * this.state.invoice.sale).toFixed(2)} SGST: {this.state.cgst}% {parseFloat((this.state.sgst / 100) * this.state.invoice.sale).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <div className="grand-total-section">
            GRAND TOTAL: {parseFloat(this.state.invoice.total).toFixed(2)}
          </div>
        </section>
        <footer>
          <div className="pull-left footer-section-sm">
            <QrCode value={this.state.invoice.id+""} size="70"/>
          </div>
          <div className="pull-left footer-section-lg">
            <p className="center-align">Goods once sold cannot be taken back.<br/>
            Thank you!<br/>
            Invoice No.: {this.state.invoice.id}<br/>
            </p>
          </div>
          <div className="clearfix"></div>
        </footer>
      </div>
    )
  }
}

module.exports = InvoiceTemplate;
