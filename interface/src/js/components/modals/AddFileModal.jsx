import React from 'react';

import Modal from "../Modal";
import {TreeEntry} from "../FileTree";
import * as M from "materialize-css";

class AddFileModal extends Modal {
  constructor(props) {
    super(props);

    this.modalEl = React.createRef();
    this.select = React.createRef();
    this.input = React.createRef();
  }

  componentDidMount() {
    super.componentDidMount();

    M.FormSelect.init(this.select.current);
    this.input.current.select();
  }

  render() {
    return (
      <div ref={this.modalEl} className="modal">
        <form autoComplete="off" onSubmit={e => {
          e.preventDefault();

          let els = e.target.elements;

          if (this.props.callback)
            this.props.callback(els.name.value, els.type.value, () => {
              this.close();
            }, e);
        }}>
          <div className="modal-content">
            <h4>New</h4>
            <div className="row">
              <div className="input-field col s12">
                <input tabIndex="1" ref={this.input} name="name" id="_addFileModal_name" type="text" className="validate" required/>
                <label htmlFor="_addFileModal_name">File Name</label>
              </div>
              <div className="input-field col s12">
                <select tabIndex="2" ref={this.select} name="type" defaultValue={TreeEntry.types.FILE}>
                  <option value={TreeEntry.types.FILE}>File</option>
                  <option value={TreeEntry.types.DIRECTORY}>Directory</option>
                </select>
                <label>Type</label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" tabIndex="3" className="modal-close waves-effect btn-flat" onClick={e => {
              if (this.props.callback)
                this.props.callback(false, e);
            }}>{this.props.cancelButton || "Cancel"}</button>
            <button tabIndex="4" className="waves-effect btn-flat">{this.props.createButton || "Create"}</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AddFileModal;