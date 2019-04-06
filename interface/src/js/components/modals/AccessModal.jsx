import React from 'react';

import Modal from '../Modal';
import {net} from '../../Util';
import {app} from '../../site';
import * as Prompt from '../Prompt';
import Tooltip from '../Tooltip';

class AccessModal extends Modal {
  constructor(props) {
    super(props);

    this.modalEl = React.createRef();

    this.handleSubmit = e => {
      e.preventDefault();

      let button = e.target.querySelector('button:focus');
      let open = button ? button.innerText.toUpperCase().startsWith('OPEN') : true;

      app.setLoading();
      net.postFormData(`php/${open ? 'open' : 'new'}.php`, {
        name: e.target.elements.username.value,
        password: e.target.elements.password.value
      }, (xhr, s) => {
        app.setLoading(false);

        if (!(s.success && s.json))
          return alert(`Failure while ${open ? 'opening' : 'creating'}: ${s.error || 'Something went wrong.'}`);

        if (!open)
          Prompt.confirm('PHP Sandbox works much like your standard OS File Manager, right click files or the editor to bring up a context menu. To execute your code, simply click the green play button in the bottom right.', (confirmed, close) => close(), 'OK', '', 'Welcome!');

        this.props.onOpen(s.json.name, s.json.tree);
      });
    };
  }

  render() {
    return (
      <div ref={this.modalEl} className="modal">
        <div className="modal-content">
          <h4>Access Sandbox</h4>
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="input-field col s12">
                <input tabIndex="1" id="_AccessModal_username" name="username" type="text" className="validate" required/>
                <label htmlFor="_AccessModal_username">Name</label>
              </div>
              <div className="input-field col s12">
                <input tabIndex="2" id="_AccessModal_password" name="password" type="password" className="validate" required/>
                <label htmlFor="_AccessModal_password">Password</label>
              </div>
              <div className="col s6">
                <Tooltip text="Return" position="top">
                  <button tabIndex="3" className="waves-effect waves-light btn-flat btn-fill">Open</button>
                </Tooltip>
              </div>
              <div className="col s6">
                <button tabIndex="4" className="waves-effect waves-light btn-flat btn-fill">Create</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AccessModal;