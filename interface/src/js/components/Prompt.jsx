import React from 'react';
import ConfirmModal from './modals/ConfirmModal';
import * as ReactDOM from 'react-dom';
import AddFileModal from './modals/AddFileModal';
import InputModal from './modals/InputModal';
import UploadModal from './modals/UploadModal';

export function confirm(msg, callback, confirmButton, cancelButton, title) {
  let container = document.querySelector('#prompt-container');
  ReactDOM.render(<ConfirmModal open={true}
                                msg={msg}
                                confirmButton={confirmButton}
                                cancelButton={cancelButton}
                                callback={callback}
                                title={title}
                                onCloseEnd={() => ReactDOM.unmountComponentAtNode(container)}/>,
    container);
}

export function addFile(callback, createButton, cancelButton) {
  let container = document.querySelector('#prompt-container');
  ReactDOM.render(<AddFileModal open={true}
                                createButton={createButton}
                                cancelButton={cancelButton}
                                callback={callback}
                                onCloseEnd={() => ReactDOM.unmountComponentAtNode(container)}/>,
    container);
}

export function input(callback, title, msg, defaultValue, input, confirmButton, cancelButton) {
  let container = document.querySelector('#prompt-container');
  ReactDOM.render(<InputModal open={true}
                              confirmButton={confirmButton}
                              cancelButton={cancelButton}
                              callback={callback}
                              title={title}
                              input={input}
                              msg={msg}
                              defaultValue={defaultValue}
                              onCloseEnd={() => ReactDOM.unmountComponentAtNode(container)}/>,
    container);
}

export function uploadFile(destination, callback, uploadButton, cancelButton, title, msg) {
  let container = document.querySelector('#prompt-container');
  ReactDOM.render(<UploadModal open={true}
                               destination={destination}
                               uploadButton={uploadButton}
                               cancelButton={cancelButton}
                               callback={callback}
                               title={title}
                               msg={msg}
                               onCloseEnd={() => ReactDOM.unmountComponentAtNode(container)}/>,
    container);
}