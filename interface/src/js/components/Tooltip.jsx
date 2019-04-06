import React, {Component} from 'react';
import * as M from 'materialize-css';

class Tooltip extends Component {
  constructor(props) {
    super(props);

    this.tooltipEl = React.createRef();
  }

  componentDidMount() {
    M.Tooltip.init(this.tooltipEl.current);
  }

  render() {
    return (
      <div style={{
        display: 'inherit'
      }} ref={this.tooltipEl} data-tooltip={this.props.text} data-position={this.props.position}>
        {this.props.children}
      </div>
    );
  }
}

export default Tooltip;