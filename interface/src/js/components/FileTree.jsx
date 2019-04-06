import React, {Component} from 'react';
import * as M from 'materialize-css';
import ContextMenu from './ContextMenu';
import * as FileUtil from '../FileUtil';
import {app} from '../site';

export class TreeEntry {
  constructor(name, type, path, contents = []) {
    this.name = name;
    this.type = type;
    this.contents = contents;
    this.path = path;
  }
}

TreeEntry.types = {
  FILE: 0,
  DIRECTORY: 1
};

class FileTree extends Component {
  constructor(props) {
    super(props);

    this.extensionColors = {
      _directory: 'grey-text text-darken-1',
      _unknown: 'grey-text',
      php: 'blue-text',
      html: 'cyan-text',
      js: 'red-text',
      css: 'yellow-text',
      txt: 'grey-text text-darken-3'
    };

    this.forEach = (tree, handler, parent, depth = 0) => {
      tree.forEach(item => {
        handler(item, parent, depth);
        if (item.type === 1)
          forEach(item.contents, handler, item, depth + 1);
      });
    };

    this.sortTree = tree => {
      tree.sort((a, b) => a.name.toUpperCase().charCodeAt(0) - b.name.toUpperCase().charCodeAt(0));
      tree.sort((a, b) => {
        if (a.type === TreeEntry.types.DIRECTORY && b.type !== TreeEntry.types.DIRECTORY)
          return -1;
        else
          return 0;
      });

      tree.forEach(file => {
        if (file.type === TreeEntry.types.DIRECTORY)
          this.sortTree(file.contents);
      });
    };

    this.getDropdown = (itemArray, directory) => {
      let directoryName = typeof directory === 'string' ? directory : directory.name;

      return (
        <li key={directoryName} className="no-padding">
          <ul className="collapsible collapsible-accordion">
            <li>
              <a className="collapsible-header" draggable={typeof directory !== 'string'} onDragStart={e => {
                e.dataTransfer.setData('text', [...directory.path, directory.name].join('/'));
              }} onDragOver={e => {
                e.preventDefault();
              }} onDrop={e => {
                e.preventDefault();

                let file = FileUtil.getFileFromTree(app.getTree(), e.dataTransfer.getData('text').split('/'));
                if (file === null)
                  return alert('Something went wrong.');
                FileUtil.moveFile(file, directory.path ? [...directory.path, directoryName] : []);
              }}>{directoryName}<i className={'material-icons ' + this.extensionColors['_directory']}>folder</i>
                {typeof directory !== 'string' ? (
                  <ContextMenu>
                    <li><a className="waves-effect" onClick={e => FileUtil.newFilePrompt([...directory.path,
                      directory.name])}><i className="material-icons">add</i>New</a></li>
                    {app && app.state.clipboard ?
                      <li><a className="waves-effect" onClick={e => app.paste([...directory.path,
                        directory.name])}><i className="material-icons">attachment</i>Paste</a></li> : ''}
                    <li>
                      <a className="waves-effect" onClick={e => FileUtil.renameFilePrompt(directory)}><i className="material-icons">short_text</i>Rename</a>
                    </li>
                    <li>
                      <a className="waves-effect" onClick={e => app.copy(directory)}><i className="material-icons">file_copy</i>Copy</a>
                    </li>
                    <li>
                      <a className="waves-effect" onClick={e => app.cut(directory)}><i className="material-icons">archive</i>Cut</a>
                    </li>
                    <li>
                      <a className="waves-effect" onClick={e => FileUtil.deleteFilePrompt(directory)}><i className="material-icons">delete</i>Delete</a>
                    </li>
                    <li className="divider" tabIndex="-1"/>
                    <li><a className="waves-effect" onClick={e => FileUtil.uploadFilePrompt([...directory.path,
                      directory.name])}><i className="material-icons">cloud_upload</i>Upload</a></li>
                    <li className="divider" tabIndex="-1"/>
                    <li><a className="waves-effect" onClick={e => FileUtil.downloadFile([...directory.path,
                      directory.name])}><i className="material-icons">get_app</i>Download</a></li>
                  </ContextMenu>
                ) : (
                  <ContextMenu>
                    <li>
                      <a className="waves-effect" onClick={e => FileUtil.newFilePrompt([])}><i className="material-icons">add</i>New</a>
                    </li>
                    {app && app.state.clipboard ? <li>
                      <a className="waves-effect" onClick={e => app.paste([])}><i className="material-icons">attachment</i>Paste</a>
                    </li> : ''}
                    <li className="divider" tabIndex="-1"/>
                    <li>
                      <a className="waves-effect" onClick={e => FileUtil.uploadFilePrompt([])}><i className="material-icons">cloud_upload</i>Upload</a>
                    </li>
                    <li className="divider" tabIndex="-1"/>
                    <li>
                      <a className="waves-effect" onClick={e => FileUtil.downloadFile([])}><i className="material-icons">get_app</i>Download</a>
                    </li>
                  </ContextMenu>
                )}
              </a>
              <div className="collapsible-body">
                <ul>
                  {itemArray.map(file => file.type === 0 ? (
                    <li key={file.name} draggable="true" onDragStart={e => {
                      e.dataTransfer.setData('text', [...file.path, file.name].join('/'));
                    }}><a className="clickable" onClick={e => {
                      if (this.props.onFileOpen)
                        this.props.onFileOpen(file);
                    }}><i className={'material-icons ' + this.extensionColors[file.name.split('.').pop()] || this.extensionColors._unknown}>insert_drive_file</i>{file.name}
                      <ContextMenu>
                        <li>
                          <a className="waves-effect" onClick={e => FileUtil.renameFilePrompt(file)}><i className="material-icons">short_text</i>Rename</a>
                        </li>
                        <li>
                          <a className="waves-effect" onClick={e => app.copy(file)}><i className="material-icons">file_copy</i>Copy</a>
                        </li>
                        <li>
                          <a className="waves-effect" onClick={e => app.cut(file)}><i className="material-icons">archive</i>Cut</a>
                        </li>
                        <li>
                          <a className="waves-effect" onClick={e => FileUtil.deleteFilePrompt(file)}><i className="material-icons">delete</i>Delete</a>
                        </li>
                        <li className="divider" tabIndex="-1"/>
                        <li><a className="waves-effect" onClick={e => FileUtil.downloadFile([...file.path, file.name])}><i className="material-icons">get_app</i>Download</a>
                        </li>
                      </ContextMenu>
                    </a></li>
                  ) : this.getDropdown(file.contents, file))}
                </ul>
              </div>
            </li>
          </ul>
        </li>
      );
    };

    this.sidenav = React.createRef();
  }

  componentDidMount() {
    M.Sidenav.init(this.sidenav.current);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    M.Collapsible.init(document.querySelectorAll('#file-tree .collapsible')).forEach(inst => {
      if (!inst.el.opened) {
        inst.open();
        inst.el.opened = true;
      }
    });
  }

  componentWillUpdate(nextProps, nextState) {
    this.sortTree(nextProps.tree);
  }

  render() {
    return (
      <ul id="file-tree" ref={this.sidenav} className="sidenav sidenav-fixed">
        {this.getDropdown(this.props.tree, this.props.name)}
      </ul>
    );
  }
}

export default FileTree;