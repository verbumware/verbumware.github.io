(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = function (stream, options, cb) {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var acxt = new AudioContext();

    var n0 = acxt.createMediaStreamSource(stream);
    var n1 = acxt.createGain();
    var n2 = acxt.createScriptProcessor(4096, 1, 1);
    n2.onaudioprocess = cb;
    return {
        start: function () {
            n0.connect(n1);
            n1.connect(n2);
            n2.connect(acxt.destination);
        },
        stop: function () {
            n0.disconnect(n1);
            n1.disconnect(n2);
            n2.disconnect(acxt.destination);
        }
    };
};

},{}],2:[function(require,module,exports){
'use strict';

module.exports = function (o/*:Object*/, successCallBack /*:function*/, errorCallBack /*:function*/) {

    navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
    );

    if (navigator.getUserMedia) {
        navigator.getUserMedia(o, successCallBack, errorCallBack);
    } else {
        console.log('can\'t get getUserMedia');
    }

};
// @flow

},{}],3:[function(require,module,exports){
'use strict';

function level (meter) {
    var old = 0;
    return function (event) {
        var i, neo;
        var inp = event.inputBuffer;
        var len = inp.length;
        var inpData = inp.getChannelData(0);

        neo = 0;
        for (i = 0; i < len; i++) {
            neo += Math.abs(inpData[i], 2);
        }
        old = (0.9 * old + 0.1 * neo);
        meter.render(old / len);
    };
}

module.exports = level;

},{}],4:[function(require,module,exports){
'use strict';

var getUserMedia = require('./get-user-media'),
    audioCxt = require('./audio-cxt'),
    level = require('./level');

function cxt (o) {

    function step1 (stream) {
        console.log(stream);
        var hooks = audioCxt(stream, {}, level(o.meter));
        o.controls.start.el.addEventListener(o.controls.start.on, hooks.start);
        o.controls.stop.el.addEventListener(o.controls.stop.on, hooks.stop);
    }

    getUserMedia(
        { audio: true },
        step1,
        function (error) {
            console.log(error);
        }
    );

}

function mic (options) {
    cxt(options);
}

window.verbumware = window.verbumware || {};
window.verbumware.mic = mic;

},{"./audio-cxt":1,"./get-user-media":2,"./level":3}]},{},[4]);
