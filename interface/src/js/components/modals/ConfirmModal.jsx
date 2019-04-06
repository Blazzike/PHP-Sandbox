import React from 'react';

import Modal from '../Modal';

class ConfirmModal extends Modal {
  constructor(props) {
    super(props);

    this.modalEl = React.createRef();
  }

  componentDidMount() {
    super.componentDidMount();
  }

  render() {
    return (
      <div ref={this.modalEl} className="modal">
        <div className="modal-content">
          <h4>{this.props.title || 'Confirm'}</h4>
          <p>{this.props.msg}</p>
        </div>
        <div className="modal-footer">
          <button className="waves-effect btn-flat" tabIndex="1" onClick={e => {
            if (this.props.callback)
              this.props.callback(true, () => {
                this.close();
              }, e);
          }}>{this.props.confirmButton || 'Yes'}</button>
          {this.props.cancelButton !== null && typeof this.props.cancelButton !== 'undefined' && this.props.cancelButton.length === 0 ? '' : (
            <button type="button" className="modal-close waves-effect btn-flat" tabIndex="2" onClick={e => {
              if (this.props.callback)
                this.props.callback(false, e);
            }}>{this.props.cancelButton || 'Cancel'}</button>
          )}
        </div>
      </div>
    );
  }
}

export default ConfirmModal;