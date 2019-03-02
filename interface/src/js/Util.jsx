import {TreeEntry} from "./components/FileTree";

export function getParameterForURL(url, param, value) {
  return `${(url.split('?')[1] ? '&' : '?')}${param}=${value}`;
}

export const net = {
  request(method, url, callback, headers = {}, data = null) {
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        let json = null;
        let error = null;
        try {
          json = JSON.parse(xhr.responseText);
          if (json.error)
            error = json.error.msg;
        } catch (x) {
        }

        callback(xhr, {
          success: this.status === 200 && error === null,
          json: json,
          error: error,
          text: this.responseText
        });
      }
    });

    xhr.open(method, url);

    Object.keys(headers).forEach(header => {
      xhr.setRequestHeader(header, headers[header]);
    });

    xhr.send(data);
  },
  post(url, data, callback, parameters = {}, headers = {}) {
    Object.keys(parameters).forEach(parameter => {
      url += getParameterForURL(url, parameter, parameters[parameter]);
    });

    this.request("POST", url, callback, headers, data);
  },
  get(url, callback, parameters = {}, headers = {}) {
    Object.keys(parameters).forEach(parameter => {
      url += getParameterForURL(url, parameter, parameters[parameter]);
    });

    this.request("GET", url, callback, headers);
  },
  postFormData(url, formData, callback, parameters = {}, headers = {}) {
    let data = new FormData();
    Object.keys(formData).forEach(name => {
      data.append(name, formData[name]);
    });

    this.post(url, data, callback, parameters, headers);
  }
};

export function arrayToTreeEntry(array, path = []) {
  let result = [];
  array.forEach(item => {
    result.push(new TreeEntry(item.name,
      item.type === "file" ? TreeEntry.types.FILE : TreeEntry.types.DIRECTORY,
      path,
      item.type === "directory" ? arrayToTreeEntry(item.contents, [...path, item.name]) : null));
  });

  return result;
}

export function esc(str) {
  let el = document.createElement("div");
  el.innerText = str;

  return el.innerHTML;
}

export function alert(str) {
  M.toast({html: esc(str)})
}

window.alert = alert;