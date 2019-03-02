import React, {Component} from 'react';
import Tooltip from "./Tooltip";
import * as M from "materialize-css";
import {app} from "../site";

class FAB extends Component {
  constructor(props) {
    super(props);

    this.fab = React.createRef();
  }

  componentDidMount() {
    M.FloatingActionButton.init(this.fab.current);
  }

  render() {
    return (
      <div>
        <div className="fixed-action-btn" ref={this.fab}>
          <Tooltip text="Execute (Ctrl + R)" position="left">
            <a className="btn-floating btn-large green waves-effect" onClick={() => app.exec()}>
              <i className="large material-icons">play_arrow</i>
            </a>
          </Tooltip>
          <ul>
            <Tooltip text="Execute in New Window (Ctrl + Shift + R)" position="left">
              <li>
                <a className="btn-floating blue darken-2" onClick={() => app.exec(true)}><i className="material-icons">add</i></a>
              </li>
            </Tooltip>
          </ul>
        </div>

        <div id="execution-modal-wrapper"/>
      </div>
    );
  }
}

export default FAB;