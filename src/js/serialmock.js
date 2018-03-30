const mock_serial = 1;

if (mock_serial) {
    chrome.serial.connect = function (path, options, callback) {
      callback({
        connectionId: 1,
        bitrate: 11540
      });
    };

  chrome.serial.send = function (connId, data, callback) {
    callback();
  }
}
