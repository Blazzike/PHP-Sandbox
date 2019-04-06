import React, {Component} from 'react';
import * as monaco from 'monaco-editor';

class Editor extends Component {
  constructor(props) {
    super(props);

    this.editor = React.createRef();
  }

  componentDidUpdate() {
    const language = this.props.language === 'js' ? 'javascript' : this.props.language;
    if (this.monaco && !this.props.open) {
      this.monaco.dispose();

      this.monaco = null;
      window.removeEventListener('keydown', this.keyDownHandler);

      return;
    }

    if (!this.monaco && this.props.open) {
      this.monaco = monaco.editor.create(this.editor.current, {
        language: language || 'php',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        autoIndent: true,
        dragAndDrop: true,
        tabSize: 2,
        theme: this.props.theme || 'vs-dark',
        wrappingIndent: 'indent',
        value: this.props.value,
        showUnused: true,
        formatOnPaste: true,
        formatOnType: true
      });

      this.monaco.getModel().updateOptions({
        tabSize: 2
      });

      this.monaco.getModel().onDidChangeContent(e => {
        this.props.onDidChangeContent(e, this.monaco.getModel());
      });

      this.focus();

      return;
    }

    if (!this.monaco)
      return;

    monaco.editor.setTheme(this.props.theme || 'vs-dark');
    monaco.editor.setModelLanguage(monaco.editor.getModels()[0], language || 'php');

    if (this.props.value !== this.monaco.getModel().getValue())
      this.monaco.setValue(this.props.value);
  }

  focus() {
    this.monaco.focus();
  }

  render() {
    return (
      <div id="editor">
        {this.props.open ? (
          <div ref={this.editor}/>
        ) : (
          <div className="valign-wrapper">
            <div className="center center-block">
              <i className="material-icons medium">insert_drive_file</i>
              <div>Open or create a file to edit it here.</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Editor;