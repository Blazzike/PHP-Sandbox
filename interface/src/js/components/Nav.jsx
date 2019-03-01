import React, {Component} from 'react';
import {app} from "../site";
import Tooltip from "./Tooltip";

class Nav extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper">
            <a className="brand-logo">PHP Sandbox</a>

            <a href="#" data-target="file-tree" className="sidenav-trigger show-on-small"><i className="material-icons">menu</i></a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <Tooltip text="Toggle Dark Theme (Ctrl + D)">
                  <a className="clickable btn btn-flat waves-effect" onClick={() => {
                    app.setTheme(app.state.theme === "dark" ? "light" : "dark");
                  }}><i className="material-icons">brightness_4</i></a>
                </Tooltip>
              </li>
              <li>
                <Tooltip text="Ctrl + S">
                  <a className="clickable btn white black-text waves-effect" onClick={() => app.save()} disabled={this.props.saved}><i className="left material-icons">save</i>Save</a>
                </Tooltip>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Nav;