import React, {Component} from 'react';
import * as M from 'materialize-css';

class Modal extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.modalInst = M.Modal.init(this.modalEl.current, this.props);

    if (this.props.open)
      this.open();
  }

  open() {
    this.modalInst.open();

    let focus = this.modalEl.current.querySelector('button,input');
    if (focus)
      focus.focus();
  }

  close() {
    this.modalInst.close();
  }
}

export default Modal;