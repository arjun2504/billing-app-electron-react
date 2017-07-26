'use strict'

var React = require('react');
var classNames = require('classnames');
var PageCard = require('../PageCard.jsx');

class Template extends React.Component
{
  constructor(props) {
      super(props);
      this.state = {
        'fields': {
          'Basic': [
            {
              'name': 'company-name',
              'type': 'text',
              'label': 'Company Name',
              'placeholder': 'Enter Company Name'
            },
            {
              'name': 'company-address',
              'type': 'textarea',
              'label': 'Address',
              'placeholder': ''
            }
          ],
          'Business Meta': [
            {
              'name': 'tin',
              'type': 'text',
              'label': 'TIN #',
              'placeholder': 'Enter TIN #'
            },
            {
              'name': 'gstin',
              'type': 'text',
              'label': 'GSTIN #',
              'placeholder': 'Enter GSTIN #'
            }
          ],
          'Custom': [
            {
              'name': 'custom1',
              'type': 'text',
              'label': 'Custom Text 1',
              'placeholder': ''
            },
            {
              'name': 'custom2',
              'type': 'text',
              'label': 'Custom Text 2',
              'placeholder': ''
            },
            {
              'name': 'custom3',
              'type': 'text',
              'label': 'Custom Text 3',
              'placeholder': ''
            }
          ]
        }
      }
  }

  render() {
    return(
      <div className="content-area">

        <PageCard icon="icon-newspaper" title="Bill Template" description="Define your headers and footers of your invoice" />

        <div className="template-form pull-left">
          <form>
          {
            Object.keys(this.state.fields).map(function(key, index) {

              return this.state.fields[key].map(function(v, i) {

                let formCategory;
                if(i==0)
                  formCategory = <h2 className="settings-category">{key}</h2>;

                let field;
                switch(v.type) {
                  case 'text':
                    field = <div className="form-group">
                                <label>{v.label}</label>
                                <input type="text" className="form-control" placeholder={v.placeholder}/>
                              </div>;
                    break;
                  case 'textarea':
                    field = <div className="form-group">
                                <label>{v.label}</label>
                                <textarea className="form-control" rows="3"></textarea>
                              </div>;
                    break;
                }


                return(
                  <span>
                    {formCategory}
                    {field}
                  </span>
                )
              }.bind(this));
            }.bind(this))
          }
          <div className="form-actions">
            <button type="submit" className="btn btn-form btn-primary">Save</button>
          </div>
          <br/>
          </form>
        </div>

      </div>
    )
  }
}

module.exports = Template;
