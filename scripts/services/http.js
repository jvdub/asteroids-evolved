game.http = (function () {
  "use strict";

  function parseJsonResponse(response) {
    if (!response.ok) {
      throw new Error("HTTP " + response.status + " for " + response.url);
    }

    return response.text().then(function (text) {
      if (!text) {
        return null;
      }

      return JSON.parse(text);
    });
  }

  function getJson(url) {
    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }).then(parseJsonResponse);
  }

  function postForm(url, data) {
    var body = new URLSearchParams();

    Object.keys(data || {}).forEach(function (key) {
      body.append(key, data[key]);
    });

    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: body,
    }).then(parseJsonResponse);
  }

  return {
    getJson: getJson,
    postForm: postForm,
  };
})();
