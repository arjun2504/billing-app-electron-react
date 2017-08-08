'use strict'

var React = require('react');

class Footer extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      options: {
            weekday: "long", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        }
    }
  }

  tick() {
    this.setState({ date: new Date() });
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return(
      <footer className="toolbar toolbar-footer">
        <h1 className="title">{this.state.date.toLocaleDateString("en-us", this.state.options)}</h1>
      </footer>
    )
  }
}

module.exports = Footer;
