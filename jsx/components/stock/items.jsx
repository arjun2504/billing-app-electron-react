'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');
//var api = require('electron').remote.getGlobal('sharedObj').api;
var api = localStorage.getItem('api');
var $ = require('jquery');
var classNames = require('classnames');

class Item extends React.Component
{
  formdata(code = '', name = '', price = '', avl = '-1') {
    return ({'product_code': code,
      'product_name': name,
      'price': price,
      'is_available': avl
    })
  }

  constructor(props) {
      super(props);
      this.state = {
        'mode': 'add',
        'currentEdit': -1,
        'showAddNew': false,
        'buttonLabel': 'Add',
        'formtitle': 'Add to Stock',
        'formdata': this.formdata(),
        'items': [],
        'fields': [
          {
            'name': 'product_code',
            'type': 'number',
            'label': 'Product Code',
            'placeholder': 'Enter Product Code'
          },
          {
            'name': 'product_name',
            'type': 'text',
            'label': 'Product Name',
            'placeholder': 'Enter name of the product'
          },
          {
            'name': 'price',
            'type': 'number',
            'label': 'Price',
            'placeholder': 'Enter Price'
          },
          {
            'name': 'is_available',
            'type': 'select',
            'label': 'Availability',
            'placeholder': '',
            'options': [
              {
                'title': '--',
                'value': -1
              },
              {
                'title': 'In Stock',
                'value': 1
              },
              {
                'title': 'Out of Stock',
                'value': 0
              }
            ]
          }
          // {
          //   'name': 'mode',
          //   'type': 'hidden'
          // },
          // {
          //   'name': 'item_id',
          //   'type': 'hidden'
          // }
        ]
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleAddItem = this.handleAddItem.bind(this);
      this.handleRowSelect = this.handleRowSelect.bind(this);
      this.handleDeleteItem = this.handleDeleteItem.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    fetch(api + "stock/all")
            .then( (response) => {
                return response.json() })
                    .then( (json) => {
                        this.setState({items: json});
                    });
  }

  handleAddItem(e) {
    e.preventDefault();

    this.state.formdata.product_code = e.target.product_code.value;
    this.state.formdata.product_name = e.target.product_name.value;
    this.state.formdata.price = e.target.price.value;
    this.state.formdata.is_available = e.target.is_available.value;
    let route;
    route = "stock/add";

    route = (this.state.mode == "add") ? "stock/add" : "stock/update/" + this.state.currentEdit;

    fetch(api + route, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.formdata)
    }).then( (response) => {
      return response.json()
    }).then( (json) => {
      if(json.status === "success") {
        this.getData();
      }
    });

  }

  handleChange(e) {
    this.state.formdata[e.target.name] = e.target.value;
  }

  handleRowSelect(itemId) {
    fetch(api + "stock/item/" + itemId).then( (response) => {
      return response.json();
    }).then( (json) => {

      var fdata = this.formdata(json.product_code, json.product_name, json.price, json.is_available);
      //console.log(fdata);
      this.setState({ 'formtitle': 'Edit ' + json.product_name, 'buttonLabel': 'Update', 'formdata': fdata, 'showAddNew': true, 'currentEdit': itemId, 'mode': 'edit' });
      document.getElementById('product_code').value = json.product_code;
      document.getElementById('product_name').value = json.product_name;
      document.getElementById('price').value = json.price;
      // document.getElementById('item_id').value = json.id;
      // document.getElementById('mode').value = 'edit';
      if(json.is_available == 1) {
        document.getElementById('is_available').options[1].selected = true;
      } else {
        document.getElementById('is_available').options[2].selected = true;
      }
      this.renderForm();
    });
  }

  handleDeleteItem(itemId) {
    var url = api + "stock/delete";
    fetch(api + "stock/delete", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'id': itemId })
    }).then((response) => { return response.json(); }).then((json) => {
      if(json.status == "success") {
        this.getData();
        this.renderEmptyForm();
      }
    })
  }

  renderEmptyForm() {
    this.setState({ 'formtitle': 'Add to Stock', 'buttonLabel': 'Add', 'formdata': this.formdata(), 'showAddNew': false, 'currentEdit': -1, 'mode': 'add' });
    document.getElementById('product_code').value = '';
    document.getElementById('product_name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('is_available').options[0].selected = true;
    this.renderForm();
  }

  renderForm() {
    return(
      <div className="stock-management pull-right">
        <h2 className="settings-category">{this.state.formtitle}</h2>
      <form action={api + 'stock/add'} method="post" onSubmit={this.handleAddItem} id="addform">
      {
        this.state.fields.map(function(v,i) {
          let field;
          switch(v.type) {
            case 'text':
              field = <div className="form-group">
                          <label>{v.label}</label>
                          <input type="text" onChange={this.handleChange} id={v.name} name={v.name} className="form-control" placeholder={v.placeholder}/>
                        </div>;
              break;
            case 'number':
              field = <div className="form-group">
                          <label>{v.label}</label>
                          <input type="number" onChange={this.handleChange} id={v.name} name={v.name} className="form-control" placeholder={v.placeholder}/>
                        </div>;
              break;
            case 'select':
              field = <div className="form-group">
                          <label>{v.label}</label>
                          <select className="form-control" name={v.name} onChange={this.handleChange} id={v.name}>
                            {
                              v.options.map(function(ov, oi) {
                                // let selected;
                                // if(ov.value === this.state.formdata[v.name])
                                //   selected = "selected";

                                return(
                                  <option value={ov.value} key={'option-' + ov.value}>{ov.title}</option>
                                )
                              }.bind(this))
                            }
                          </select>
                        </div>;
              break;
            // case 'hidden':
            //   if(v.name == 'mode')
            //     field = <input type="hidden" name={v.name} id={v.name} value="add"/>;
            //   else
            //     field = <input type="hidden" name={v.name} id={v.name} value={v.id}/>;
            //   break;
          }

          return(
            <span key={'field-' + v.name}>{field}</span>
          )
        }.bind(this))

      }
      <br/>
      <div className="form-actions">
        <button type="submit" className="btn btn-form btn-primary pull-left">{this.state.buttonLabel}</button>
        {
          this.state.showAddNew && <button type="button" className="btn btn-form btn-negative pull-left" onClick={() => { this.handleDeleteItem(this.state.currentEdit) }}>Delete</button>
        }
        {
          this.state.showAddNew && <button type="button" className="btn btn-form btn-default pull-right" onClick={() => { this.renderEmptyForm() }}>Add New Item</button>
        }
      </div>
      <br/>
      </form>
      </div>
    )
  }
  render() {
    return(

      <div className="content-area">
        <PageCard icon="icon-list-add" title="Stock Management" description="Add, edit or remove items from stock" />
          <div className="stock-table pull-left">
          <table className="table-striped">
            <thead>
              <tr>
                <th>Code</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.items.map(function(v, i) {
                  let availability
                  availability = (v.is_available == 1) ? "In Stock" : "Out of Stock";
                  var activeRow = classNames({
                    currentrow: this.state.currentEdit == v.id
                  });
                  return(
                    <tr key={v.id} className={activeRow} onClick={() => { this.handleRowSelect(v.id) } } id={'row-' + v.id}>
                      <td>{v.product_code}</td>
                      <td>{v.product_name}</td>
                      <td>{v.price}</td>
                      <td>{availability}</td>
                    </tr>
                  )
                }.bind(this))
              }

            </tbody>
          </table>
          </div>

          {this.renderForm()}

      </div>
    )
  }
}

module.exports = Item;
