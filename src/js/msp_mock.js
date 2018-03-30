'use strict';

const mock_msp = 0;

const originalMSPnotify = MSP.notify;
const originalMSPsend_message = MSP.send_message;

const MSPMock = {
    notify: function() {
      if (mock_msp) {
        console.log('Mocking msp.notify', this.code, this.dataView);
        this.code = code;
        chrome.storage.local.get('mspMock' + code, function (result) {
          this.dataView = result['mspMock' + code];
        })
      } else {
        console.log('Recording msp.notify', this.code, this.dataView);
        //chrome.storage.local.set({['mspMock' + this.code]: this.dataView})
      }

      originalMSPnotify.call(this);
    },
    send_message: function (code, data, callback_sent, callback_msp, callback_onerror) {
      if (mock_msp) {
        console.log('Mocking msp.send_message', code, data);
        callback_sent && callback_sent();
        // setTimeout(() => {
          this.notify();
        // }, 100);
        return true;
      } else {
        return originalMSPsend_message.call(this, code, data, callback_sent, callback_msp, callback_onerror)
      }
    }
};


MSP = Object.assign({}, MSP, MSPMock);
