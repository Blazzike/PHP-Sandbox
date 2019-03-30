import React, {Component} from 'react';
import FileTree from "./FileTree"
import Nav from "./Nav"
import Editor from "./Editor";
import * as FileUtil from "../FileUtil";

import {arrayToTreeEntry, net} from "../Util";
import AccessModal from "./modals/AccessModal";
import * as ReactDOM from "react-dom";
import ExecutionModal from "./modals/ExecutionModal";
import {app} from "../site";
import FAB from "./FAB";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      openFile: null,
      loading: this.props.loading,
      tree: this.props.tree || [],
      name: "",
      saved: true,
      clipboard: null,
      theme: "dark"
    };

    this.accessModal = React.createRef();
    this.editorRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => this.accessModal.current.open());

    window.addEventListener("beforeunload", e => {
      if (this.state.saved)
        return;

      e.preventDefault();
      e.returnValue = "Save your changes!";
      return "Save your changes!";
    });

    window.addEventListener("keydown", e => {
      if (e.ctrlKey) {
        if (e.shiftKey) {
          if (e.which === 82) {
            if (this.state.openFile)
              app.exec(true);

            e.preventDefault();

            return;
          }
        }

        if (e.which === 83) {
          app.save();

          e.preventDefault();
        } else if (e.which === 82) {
          if (this.state.openFile)
            app.exec();

          e.preventDefault();
        } else if (e.which === 68) {
          app.setTheme(this.state.theme === "dark" ? "light" : "dark");

          e.preventDefault();
        }
      }
    });
  }

  setTree(tree = []) {
    this.setState({
      tree: tree
    });
  }

  getTree() {
    return this.state.tree;
  }

  setLoading(loading = true) {
    this.setState({
      loading: loading
    });
  }

  setSaved(saved = true) {
    this.setState({
      saved: saved
    });
  }

  setTheme(theme) {
    this.setState({
      theme: theme
    });
  }

  copy(file) {
    this.setState({
      clipboard: {
        file: file,
        type: 0 // 0 = copy
      }
    });
  }

  cut(file) {
    this.setState({
      clipboard: {
        file: file,
        type: 1 // 1 = cut
      }
    });
  }

  exec(newWindow = false) {
    this.save(saved => {
      if (!saved)
        return;

      let path = [...this.state.openFile.path, this.state.openFile.name];
      if (newWindow) {
        window.open("php/operations/run/" + path.join("/"), "execution-window", "menubar=0");

        return;
      }

      ReactDOM.render(<ExecutionModal path={path} open={true} onCloseEnd={() => {
        ReactDOM.unmountComponentAtNode(document.getElementById("execution-modal-wrapper"));

        this.editorFocus();
      }}/>, document.getElementById("execution-modal-wrapper"));
    });
  }

  paste(path) {
    let c = this.state.clipboard;
    if (c.type === 1) {
      FileUtil.moveFile(c.file, path);
    } else {
      FileUtil.copyFile(c.file, path);
    }

    this.setState({
      clipboard: null
    });
  }

  save(callback) {
    if (this.state.saved) {
      if (callback)
        callback(true);

      return;
    }

    FileUtil.writeFile(this.state.openFile, this.state.value, (s) => {
      if (!(s.success && s.json)) {
        if (callback)
          callback(false);

        return;
      }

      this.setState({
        saved: true
      });

      alert("File saved.");

      if (callback)
        callback(true);
    });
  }

  reloadTree(callback) {
    net.get(`php/tree.php`, (xhr, s) => {
      if (!(s.success && s.json)) {
        if (callback)
          callback(false, s);

        return alert(`Failure while fetching the directory tree: ${s.error || "Something went wrong."}`);
      }

      this.setState({
        tree: arrayToTreeEntry(s.json.tree)
      });

      if (callback)
        callback(true, s);
    });
  }

  editorFocus() {
    if (this.state.openFile)
      this.editorRef.current.focus();
  }

  close() {
    this.setState({
      openFile: null
    });
  }

  render() {
    let s = this.state;
    return (
      <div>
        {s.theme === "light" ? (
          <div>
            <link rel="stylesheet" href="css/bundle-light.css?v6"/>
          </div>
        ) : ""}

        {s.loading ? (
          <div id="loadingContainer">
            <div className="valign-wrapper">
              <div className="center-block">
                <div className="preloader-wrapper big active">
                  <div className="spinner-layer spinner-white-only">
                    <div className="circle-clipper left">
                      <div className="circle"/>
                    </div>
                    <div className="gap-patch">
                      <div className="circle"/>
                    </div>
                    <div className="circle-clipper right">
                      <div className="circle"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : ""}

        <Nav saved={s.saved}/>
        <FileTree tree={s.tree} name={s.name} onFileOpen={file => {
          this.save(success => {
            if (!success)
              return;

            this.setLoading();
            net.get("php/operations/read.php", (xhr, s) => {
              this.setLoading(false);

              if (!(s.success && s.json))
                return alert(`Failure while reading: ${s.error || "Something went wrong."}`);

              this.setState({
                value: s.json.content,
                openFile: file
              });
            }, {
              path: [...file.path, file.name].join("/")
            });
          });
        }}/>

        <main>
          <Editor theme={s.theme === "light" ? "vs-light" : "vs-dark"} ref={this.editorRef} open={s.openFile} value={s.value} onDidChangeContent={(e, model) => {
            let value = model.getValue();
            if (this.state.value === value)
              return;

            this.setState({
              saved: false,
              value: value
            });
          }}/>
        </main>

        <AccessModal ref={this.accessModal} dismissible={false} onOpen={(name, treeArray) => {
          this.setState({
            name: name,
            tree: arrayToTreeEntry(treeArray)
          });

          let treeTimeout = () => {
            this.reloadTree(() => {
              setTimeout(treeTimeout, 30000);
            });
          };

          setTimeout(treeTimeout, 30000);

          this.accessModal.current.close();
        }}/>

        {s.openFile ? (<FAB/>) : ""}

        <div id="prompt-container"/>
      </div>
    );
  }
}

export default App;