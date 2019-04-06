import React from 'react';

import Modal from '../Modal';
import {arrayToTreeEntry, net} from '../../Util';
import {app} from '../../site';

class UploadModal extends Modal {
  constructor(props) {
    super(props);

    this.modalEl = React.createRef();
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    super.componentDidMount();
  }

  render() {
    return (
      <div ref={this.modalEl} className="modal">
        <form autoComplete="off" onSubmit={e => {
          e.preventDefault();

          app.setLoading();
          net.post('php/operations/upload.php?path=' + [this.props.destination,
            this.fileInput.current.files[0].name].join('/'), new FormData(e.target), (xhr, s) => {
            app.setLoading(false);

            if (!(s.success && s.json))
              return alert(`Failure while uploading: ${s.error || 'Something went wrong.'}`);

            app.setTree(arrayToTreeEntry(s.json.tree));

            if (this.props.callback)
              this.props.callback(s.success, () => {
                this.close();
              }, e);
          });
        }}>
          <div className="modal-content">
            <h4>{this.props.title || 'Upload'}</h4>
            <p>{this.props.msg}</p>
            <div className="row">
              <div className="file-field input-field s12">
                <div className="btn">
                  <span>File</span>
                  <input ref={this.fileInput} name="file" type="file" placeholder="5MBs or smaller file" required/>
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text"/>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="modal-close waves-effect btn-flat" tabIndex="2" onClick={e => {
              if (this.props.callback)
                this.props.callback(false, e);
            }}>{this.props.cancelButton || 'Cancel'}</button>
            <button className="waves-effect btn-flat" tabIndex="3">{this.props.uploadButton || 'Upload'}</button>
          </div>
        </form>
      </div>
    );
  }
}

export default UploadModal;