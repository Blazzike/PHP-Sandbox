import React, {Component} from 'react';
import * as M from "materialize-css";
import ContextMenu from "./ContextMenu";
import * as FileUtil from "../FileUtil";
import {app} from "../site";

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

    this.forEach = (tree, handler, parent, depth = 0) => {
      tree.forEach(item => {
        handler(item, parent, depth);
        if (item.type === 1)
          forEach(item.contents, handler, item, depth + 1);
      });
    };

    this.getDropdown = (itemArray, directory) => {
      let directoryName = typeof directory === "string" ? directory : directory.name;

      return (
      <li key={directoryName} className="no-padding">
        <ul className="collapsible collapsible-accordion">
          <li>
            <a className="collapsible-header" draggable={typeof directory !== "string"} onDragStart={e => {
              e.dataTransfer.setData("text", [...directory.path, directory.name].join("/"));
            }} onDragOver={e => {
              e.preventDefault();
            }} onDrop={e => {
              e.preventDefault();

              let file = FileUtil.getFileFromTree(app.getTree(), e.dataTransfer.getData("text").split("/"));
              if (file === null)
                return alert("Something went wrong.");
              FileUtil.moveFile(file, directory.path ? [...directory.path, directoryName] : []);
            }}>{directoryName}<i className="material-icons">folder</i>
              {typeof directory !== "string" ? (
                <ContextMenu>
                  <li><a className="waves-effect" onClick={e => FileUtil.newFilePrompt([...directory.path, directory.name])}><i className="material-icons">add</i>New</a></li>
                  {app && app.state.clipboard ? <li><a className="waves-effect" onClick={e => app.paste([...directory.path, directory.name])}><i className="material-icons">attachment</i>Paste</a></li> : ""}
                  <li><a className="waves-effect" onClick={e => FileUtil.renameFilePrompt(directory)}><i className="material-icons">short_text</i>Rename</a></li>
                  <li><a className="waves-effect" onClick={e => app.copy(directory)}><i className="material-icons">file_copy</i>Copy</a></li>
                  <li><a className="waves-effect" onClick={e => app.cut(directory)}><i className="material-icons">save_alt</i>Cut</a></li>
                  <li><a className="waves-effect" onClick={e => FileUtil.deleteFilePrompt(directory)}><i className="material-icons">delete</i>Delete</a></li>
                  <li className="divider" tabIndex="-1"/>
                  <li><a className="waves-effect" onClick={e => FileUtil.uploadFilePrompt([...directory.path, directory.name])}><i className="material-icons">cloud_upload</i>Upload</a></li>
                  <li className="divider" tabIndex="-1"/>
                  <li><a className="waves-effect" onClick={e => FileUtil.downloadFile([...directory.path, directory.name])}><i className="material-icons">get_app</i>Download</a></li>
                </ContextMenu>
              ) : (
                <ContextMenu>
                  <li><a className="waves-effect" onClick={e => FileUtil.newFilePrompt([])}><i className="material-icons">add</i>New</a></li>
                  {app && app.state.clipboard ? <li><a className="waves-effect" onClick={e => app.paste([])}><i className="material-icons">attachment</i>Paste</a></li> : ""}
                  <li className="divider" tabIndex="-1"/>
                  <li><a className="waves-effect" onClick={e => FileUtil.uploadFilePrompt([])}><i className="material-icons">cloud_upload</i>Upload</a></li>
                  <li className="divider" tabIndex="-1"/>
                  <li><a className="waves-effect" onClick={e => FileUtil.downloadFile([])}><i className="material-icons">get_app</i>Download</a></li>
                </ContextMenu>
              )}
            </a>
            <div className="collapsible-body">
              <ul>
                {itemArray.map(file => file.type === 0 ? (
                  <li key={file.name} draggable="true" onDragStart={e => {
                    e.dataTransfer.setData("text", [...file.path, file.name].join("/"));
                  }}><a className="clickable" onClick={e => {
                    if (this.props.onFileOpen)
                      this.props.onFileOpen(file);
                  }}><i className="material-icons">insert_drive_file</i>{file.name}
                    <ContextMenu>
                      <li><a className="waves-effect" onClick={e => FileUtil.renameFilePrompt(file)}><i className="material-icons">short_text</i>Rename</a></li>
                      <li><a className="waves-effect" onClick={e => app.copy(file)}><i className="material-icons">file_copy</i>Copy</a></li>
                      <li><a className="waves-effect" onClick={e => app.cut(file)}><i className="material-icons">save_alt</i>Cut</a></li>
                      <li><a className="waves-effect" onClick={e => FileUtil.deleteFilePrompt(file)}><i className="material-icons">delete</i>Delete</a></li>
                      <li className="divider" tabIndex="-1"/>
                      <li><a className="waves-effect" onClick={e => FileUtil.downloadFile([...file.path, file.name])}><i className="material-icons">get_app</i>Download</a></li>
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
    M.Collapsible.init(document.querySelectorAll("#file-tree .collapsible")).forEach(inst => inst.open());

    M.Sidenav.init(this.sidenav.current);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.componentDidMount();
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