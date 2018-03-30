'use strict';

const mock_msp = 1;

const originalMSPnotify = MSP.notify;
const originalMSPsend_message = MSP.send_message;

var MSPMockData = {};

const MSPMock = {
    notify: function() {
      if (!mock_msp) {
        console.log('Recording msp.notify', this.code, MSPCodesToName[this.code], this.dataView);

        MSPMockData[this.code] = this.message_buffer;
      }

      originalMSPnotify.call(this);
    },
    notify_mock: function (code) {
      this.code = code;
      this.message_buffer = MSPMockData[this.code];
      this.message_length_expected = this.message_buffer.byteLength;

      this.dataView = new DataView(this.message_buffer, 0, this.message_length_expected);

      console.log('Mocking msp.notify', this.code, MSPCodesToName[this.code], this.dataView);

      originalMSPnotify.call(this);
    },
    send_message: function (code, data, callback_sent, callback_msp, callback_onerror) {
      if (mock_msp) {
        originalMSPsend_message.call(this, code, data, callback_sent, callback_msp, callback_onerror)
        callback_sent && callback_sent();
         setTimeout(() => {
          this.notify_mock(code);
         }, 100);
        return true;
      } else {
        return originalMSPsend_message.call(this, code, data, callback_sent, callback_msp, callback_onerror)
      }
    }
};


MSP = Object.assign({}, MSP, MSPMock);
