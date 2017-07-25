'use strict'

var React = require('react');
var ReactDOM = require('react-dom');

var Navigation = require('./components/Navigation.jsx');
var Sidebar = require('./components/Sidebar.jsx');
var Content = require('./components/Content.jsx');
var Footer = require('./components/Footer.jsx');
var Welcome = require('./components/welcome/welcome.jsx');

var App = React.createClass(
{
  getInitialState: function() {
    return { component: Welcome }
  },

  //componentDidMount: function() { },

  changeComponent: function(data) {
      this.setState({ component: data.component });
  },

  render: function() {
    return(
      <div className="window">
        <Navigation />
        <div className="window-content">
          <div className="pane-group">
            <Sidebar changeComponent={this.changeComponent}/>
            <div className="pane">
              <div className="app-inside">
                <Content component={this.state.component} />
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    )
  }
});

ReactDOM.render(<App/>, document.getElementById('root'));
