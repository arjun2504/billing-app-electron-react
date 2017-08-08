'use strict'

var React = require('react');
var PageCard = require('../PageCard.jsx');

class About extends React.Component
{
  constructor(props) {
      super(props);
      var title = localStorage.getItem('company_name');
      title = (title == null) ? "Contact Information of Developer" : "Developed for " + title;
      this.state = {
        description: title
      }
  }

  render() {
    return(
      <div className="content-area">
        <PageCard icon="icon-info" title="About" description={this.state.description} />
        <p className="about">
          Developed by Arjun R R<br/>
          <span className="icon icon-mail"></span> arjun2504@gmail.com<br/>
          <span className="icon icon-mobile"></span> +91 944 367 6221<br/>
          <span className="icon icon-globe"></span> www.arjunrr.com
        </p>
      </div>
    )
  }
}

module.exports = About;
