import React from 'react';

import Modal from "../Modal";
import {app, setLoading} from "../../site";
import {net} from "../../Util";
import * as M from "materialize-css";
import Tooltip from "../Tooltip";

class ExecutionModal extends Modal {
  constructor(props) {
    super(props);

    this.modalEl = React.createRef();
    this.tabs = React.createRef();

    this.state = {
      text: null
    };
  }

  componentDidMount() {
    super.componentDidMount();
    M.Tabs.init(this.tabs.current);
  }

  render() {
    return (
      <div ref={this.modalEl} className="modal bottom-sheet modal-fixed-footer">
        <div className="modal-content">
          <h4>PHP Execution</h4>
          <div className="row">
            <div className="col s12">
              <ul ref={this.tabs} className="tabs">
                <li className="tab col s6"><a className="active" href="#_ExecutionModal_html">HTML</a></li>
                <li className="tab col s6"><a href="#_ExecutionModal_text">Text</a></li>
              </ul>
            </div>
            <div id="_ExecutionModal_text" className="col s12">
              {this.state.text ? (
                <pre style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  overflowWrap: "break-word"
                }} className="selectable">{this.state.text}</pre>
              ) : (
                <a className="btn-large btn-fill waves-effect white black-text" onClick={e => {
                  app.setLoading();
                  net.get(`php/operations/run.php`, (xhr, s) => {
                    app.setLoading(false);

                    if (!s.success)
                      return alert(`Failure while running: ${s.error || "Something went wrong."}`);

                    this.setState({
                      text: s.text
                    });

                    app.reloadTree();
                  }, {
                    path: this.props.path.join("/")
                  });
                }}>Execute as Text</a>
              )}
            </div>
            <div id="_ExecutionModal_html" className="col s12">
              <iframe onLoad={e => app.reloadTree()} src={`php/operations/run/${this.props.path.join("/")}`} frameBorder="no" width="100%" height="130px"/>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="modal-close waves-effect btn-flat black-text">
            <Tooltip text="Esc" position="top">Close</Tooltip></button>
        </div>
      </div>
    );
  }
}

export default ExecutionModal;