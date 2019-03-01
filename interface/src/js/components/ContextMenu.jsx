import React, {Component} from 'react';
import * as ReactDOM from "react-dom";

class ContextMenu extends Component {
  constructor(props) {
    super(props);

    this.el = React.createRef();

    this.contextMenuHandler = (e, contextContainer) => {
      ReactDOM.render(this.props.children, contextContainer);
      Object.assign(contextContainer.style, {
        display: "block",
        position: "fixed",
        left: e.clientX + "px",
        top: e.clientY + "px",
        opacity: 1
      });

      e.preventDefault();
    };
  }

  componentWillUnmount() {
    this.el.current.parentElement.removeEventListener( "contextmenu", this.contextMenuHandler);
  }

  componentDidMount() {
    let contextContainer = document.querySelector("#context-container");
    if (!contextContainer) {
      let el = document.createElement("ul");
      el.id = "context-container";
      el.className = "el-content dropdown-content";
      document.body.appendChild(el);

      contextContainer = el;

      document.addEventListener("click", e => contextContainer.style.display = "none");
    }

    this.el.current.parentElement.addEventListener("contextmenu", e => this.contextMenuHandler(e, contextContainer));
  }

  render() {
    return <div ref={this.el}/>;
  }
}

export default ContextMenu;