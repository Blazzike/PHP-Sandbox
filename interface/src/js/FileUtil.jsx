import * as Prompt from "./components/Prompt";
import React from "react";
import {app} from "./site";
import {TreeEntry} from "./components/FileTree";
import {net} from "./Util";

export function getFileFromTree(tree, path) {
  for (let file of tree) {
    if (file.name === path[0]) {
      if (path.length === 1)
        return file;

      return getFileFromTree(file.contents, path.slice(1));
    }
  }

  return null;
}

export function addFileToTree(file, tree, path) {
  if (path.length === 0) {
    tree.push(file);

    return true;
  }

  for (let i = 0; i < tree.length; i++) {
    let item = tree[i];
    if (item.name === path[0]) {
      if (path.length === 1) {
        if (item.type === TreeEntry.types.FILE)
          return false;

        item.contents.push(file);

        return true;
      }

      return addFileToTree(file, item.contents, path.slice(1));
    }
  }

  return false;
}

export function removeFileFromTree(tree, path) {
  for (let i = 0; i < tree.length; i++) {
    let file = tree[i];
    if (file.name === path[0]) {
      if (path.length === 1) {
        tree.splice(i, 1);

        return true;
      }

      return removeFileFromTree(file.contents, path.slice(1));
    }
  }

  return false;
}

export function deleteFilePrompt(file) {
  Prompt.confirm(`Are you sure you want to delete ${file.name}?`, (confirmed, close) => {
    if (!confirmed)
      return;

    let fileFullPath = [...file.path, file.name];
    net.get(`php/operations/unlink.php`, (xhr, s) => {
      app.setLoading(false);

      if (!(s.success && s.json))
        return alert(`Failure while deleting: ${s.error || "Something went wrong."}`);

      close();

      if (app.state.openFile) {
        let openFullPath = [...app.state.openFile.path, app.state.openFile.name];
        if (file.type === TreeEntry.types.DIRECTORY) {
          if (openFullPath.join("/").startsWith(file.path.join("/"))) {
            app.setSaved();
            app.close();
          }
        } else if (openFullPath.join("/") === fileFullPath.join("/")) {
          app.setSaved();
          app.close();
        }
      }

      if (removeFileFromTree(app.getTree(), fileFullPath))
        app.setTree(app.getTree());
      else
        alert("Failed to update tree.");
    }, {
      path: fileFullPath.join("/")
    });
  });
}

export function newFile(type, name, path, callback) {
  let file = new TreeEntry(name, type, path);
  if (getFileFromTree(app.getTree(), [...path, name]))
    return alert("File or directory already exists with that name.");

  writeFile(file, "", s => {
    if (callback)
      callback(s);

    if (!(s.success && s.json))
      return;

    if (addFileToTree(file, app.getTree(), path))
      app.setTree(app.getTree());
    else
      alert("Failed to update tree.");
  });
}

export function writeFile(file, content, callback) {
  app.setLoading();
  net.postFormData(`php/operations/${file.type === TreeEntry.types.FILE ? "write" : "mkdir"}.php`, {
    value: content
  }, (xhr, s) => {
    app.setLoading(false);

    callback(s);

    if (!(s.success && s.json))
      return alert(`Failure while writing: ${s.error || "Something went wrong."}`);
  }, {
    path: [...file.path, file.name].join("/")
  });
}

export function newFilePrompt(path) {
  Prompt.addFile((name, type, closePrompt) => {
    if (!name)
      return;

    newFile(parseInt(type), name, path, s => {
      if (!(s.success && s.json))
        return;

      closePrompt();
    });
  });
}

export function uploadFilePrompt(path) {
  Prompt.uploadFile(path, (success, closePrompt) => {
    if (success)
      closePrompt();
  });
}

export function uniqueName(path, id = 1) {
  let name = `${path[path.length - 1]}${id === 1 ? "" : ` [${id}]`}`;
  if (getFileFromTree(app.getTree(), [...path.slice(0, path.length - 1), name]))
    return uniqueName(path, id + 1);

  return name;
}

export function basename(str) {
  let base = String(str).substring(str.lastIndexOf('/') + 1);
  if(base.lastIndexOf(".") !== -1)
    base = base.substring(0, base.lastIndexOf("."));

  return base;
}

export function copyFile(file, newPath, callback, newName = file.name) {
  newName = uniqueName([...newPath, newName]);
  // if (getFileFromTree(app.getTree(), [...newPath, newName]))
  //   return alert("File or directory already exists with that name.");

  app.setLoading();
  net.get(`php/operations/cp.php`, (xhr, s) => {
    app.setLoading(false);

    if (callback)
      callback(s);

    if (!(s.success && s.json))
      return alert(`Failure while copying: ${s.error || "Something went wrong."}`);

    file = new TreeEntry(newName, file.type, newPath, file.contents);

    if (!addFileToTree(file, app.getTree(), newPath))
      alert("Failed to update tree.");

    updatePaths(app.getTree());
    app.setTree(app.getTree());
  }, {
    path: [...file.path, file.name].join("/"),
    newPath: [...newPath, newName].join("/")
  });
}

export function moveFile(file, newPath, callback, newName = file.name) {
  let fileFullPath = [...file.path, file.name];
  let newFileFullPath = [...newPath, newName];
  if (fileFullPath.join("/") === newFileFullPath.join("/"))
    return alert("Cannot move to the same place.");

  newName = uniqueName(newFileFullPath);
  // if (getFileFromTree(app.getTree(), [...newPath, newName]))
  //   return alert("File or directory already exists with that name.");

  app.setLoading();
  net.get(`php/operations/rename.php`, (xhr, s) => {
    app.setLoading(false);

    if (callback)
      callback(s);

    if (!(s.success && s.json))
      return alert(`Failure while moving/renaming: ${s.error || "Something went wrong."}`);

    if (app.state.openFile) {
      let openFullPath = [...app.state.openFile.path, app.state.openFile.name];
      if (file.type === TreeEntry.types.DIRECTORY) {
        if (openFullPath.join("/").startsWith(file.path.join("/"))) {
          app.save(success => {
            if (success)
              app.close();
          });
        }
      } else if (openFullPath.join("/") === fileFullPath.join("/")) {
        app.save(success => {
          if (success)
            app.close();
        });
      }
    }

    if (!removeFileFromTree(app.getTree(), [...file.path, file.name]))
      return alert("Failed to update tree.");

    file = new TreeEntry(newName, file.type, newPath, file.contents);

    if (!addFileToTree(file, app.getTree(), newPath))
      alert("Failed to update tree.");

    updatePaths(app.getTree());
    app.setTree(app.getTree());
  }, {
    path: fileFullPath.join("/"),
    newPath: newFileFullPath.join("/")
  });
}

export function renameFilePrompt(file) {
  Prompt.input((value, close) => {
    if (!value)
      return;

    moveFile(file, file.path, s => {
      if (!(s.success && s.json))
        return;

      close();
    }, value);
  }, "New Name", null, file.name, "Name");
}

export function updatePaths(tree, path = []) {
  tree.forEach(item => {
    item.path = path;
    if (item.type === TreeEntry.types.DIRECTORY)
      updatePaths(item.contents, [...path, item.name]);
  });
}

export function downloadFile(path) {
  window.location = `php/operations/download.php?path=${path.join("/")}`;
}