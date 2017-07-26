'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');

class Item extends React.Component
{
  constructor(props) {
      super(props);
      this.state = {
        'fields': [
          {
            'name': 'code',
            'type': 'number',
            'label': 'Product Code',
            'placeholder': 'Enter Product Code'
          },
          {
            'name': 'product-name',
            'type': 'text',
            'label': 'Product Name',
            'placeholder': 'Enter name of the product'
          },
          {
            'name': 'price',
            'type': 'number',
            'label': 'Price',
            'placeholder': 'Enter Price'
          }
        ]
      }
  }

  render() {
    return(

      <div className="content-area">
        <PageCard icon="icon-list-add" title="Stock Management" description="Add, edit or remove items from stock" />
          <table className="stock-table table-striped pull-left">
            <thead>
              <tr>
                <th>Code</th>
                <th>Product Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1234</td>
                <td>Shirt</td>
                <td>300.0</td>
              </tr>
              <tr>
                <td>1235</td>
                <td>T-Shirt</td>
                <td>600.0</td>
              </tr>
            </tbody>
          </table>
        <div className="stock-management pull-right">
          <h2 className="settings-category">Add to Stock</h2>
          <form>
          {
            this.state.fields.map(function(v,i) {
              let field;
              switch(v.type) {
                case 'text':
                  field = <div className="form-group">
                              <label>{v.label}</label>
                              <input type="text" className="form-control" placeholder={v.placeholder}/>
                            </div>;
                  break;
                case 'number':
                  field = <div className="form-group">
                              <label>{v.label}</label>
                              <input type="number" className="form-control" placeholder={v.placeholder}/>
                            </div>;
                  break;
              }


              return(
                <span key={'field-' + v.name}>{field}</span>
              )
            }.bind(this))
          }
          <br/>
          <div className="form-actions">
            <button type="submit" className="btn btn-form btn-primary">Add</button>
          </div>
          <br/>
          </form>
        </div>
      </div>
    )
  }
}

module.exports = Item;
