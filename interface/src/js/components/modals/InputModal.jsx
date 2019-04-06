import React from 'react';

import Modal from '../Modal';
import * as M from 'materialize-css';

class InputModal extends Modal {
  constructor(props) {
    super(props);

    this.modalEl = React.createRef();
    this.input = React.createRef();
  }

  componentDidMount() {
    super.componentDidMount();

    M.updateTextFields();
    this.input.current.select();
  }

  render() {
    return (
      <div ref={this.modalEl} className="modal">
        <form autoComplete="off" onSubmit={e => {
          e.preventDefault();

          if (this.props.callback)
            this.props.callback(e.target.elements.input.value, () => {
              this.close();
            }, e);
        }}>
          <div className="modal-content">
            <h4>{this.props.title || 'Input'}</h4>
            <p>{this.props.msg}</p>
            <div className="row">
              <div className="input-field col s12">
                <input tabIndex="1" ref={this.input} name="input" id="_InputModal_input" type="text" className="validate" required defaultValue={this.props.defaultValue}/>
                <label htmlFor="_InputModal_input">{this.props.input || 'Input'}</label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="modal-close waves-effect btn-flat" tabIndex="2" onClick={e => {
              if (this.props.callback)
                this.props.callback(false, e);
            }}>{this.props.cancelButton || 'Cancel'}</button>
            <button className="waves-effect btn-flat" tabIndex="3">{this.props.confirmButton || 'Confirm'}</button>
          </div>
        </form>
      </div>
    );
  }
}

export default InputModal;