'use strict'

var React = require('react');
var classNames = require('classnames');

class Sidebar extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      'active': null,
      'items': {
        'Invoice': [
          {
            'name': 'invoice',
            'title': 'Invoice',
            'icon': 'icon icon-basket',
            'component': require('./billing/invoice.jsx')
          },
          {
            'name': 'history',
            'title': 'History',
            'icon': 'icon icon-ccw',
            'component': require('./billing/history.jsx')
          }
        ],
        'Stock': [
          {
            'name': 'items',
            'title': 'Manage Items',
            'icon': 'icon icon-list-add',
            'component': require('./stock/items.jsx')
          }
        ],
        'Settings': [
          {
            'name': 'general',
            'title': 'General',
            'icon': 'icon icon-cog',
            'component': require('./settings/general.jsx')
          },
          {
            'name': 'api',
            'title': 'API',
            'icon': 'icon icon-code',
            'component': require('./settings/api.jsx')
          },
          {
            'name': 'template',
            'title': 'Bill Template',
            'icon': 'icon icon-newspaper',
            'component': require('./settings/template.jsx')
          },
          {
            'name': 'about',
            'title': 'About',
            'icon': 'icon icon-info-circled',
            'component': require('./settings/about.jsx')
          }
        ]
      }
    }
  }

  _handleClick(data) {
    this.state.active = data.name;
    this.props.changeComponent({ component: data.component });
  }

  render() {
    return(

      <nav className="nav-group">
        {
          Object.keys(this.state.items).map(function(key, val) {
            return this.state.items[key].map(function(v, i) {
              var anchorClasses = classNames({
                                    'nav-group-item' : true,
                                    'active' : v.name === this.state.active
                                });

              let categoryTitle;

              if(i == 0)
                categoryTitle = <h5 className="nav-group-title">{key}</h5>;

              return(
                <span>
                  {categoryTitle}
                  <a className={anchorClasses} onClick={ () => this._handleClick(v) } key={"menu-" + v.name}>
                    <span className={v.icon}></span>
                    {v.title}
                  </a>
                </span>
              )

            }.bind(this));

          }.bind(this))

        }

      </nav>

    )
  }
}


module.exports = Sidebar;
