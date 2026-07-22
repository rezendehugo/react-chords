"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _ = _interopRequireDefault(require("../"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var sharedAudioContext;
var getAudioContext = function getAudioContext() {
  if (typeof window === 'undefined') {
    return null;
  }
  var AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    return null;
  }
  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    sharedAudioContext = new AudioContextConstructor();
  }
  return sharedAudioContext;
};

// Função para tocar o som do acorde
var playChord = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(position) {
    var midiNotes, audioContext, midiToFreq;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          midiNotes = position.midi || [];
          if (!(!midiNotes || midiNotes.length === 0)) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          audioContext = getAudioContext();
          if (audioContext) {
            _context.n = 2;
            break;
          }
          return _context.a(2);
        case 2:
          if (!(audioContext.state === 'suspended')) {
            _context.n = 3;
            break;
          }
          _context.n = 3;
          return audioContext.resume();
        case 3:
          midiToFreq = function midiToFreq(midi) {
            return 440 * Math.pow(2, (midi - 69) / 12);
          };
          midiNotes.forEach(function (midiNote) {
            var oscillator = audioContext.createOscillator();
            var gainNode = audioContext.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(midiToFreq(midiNote), audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 1);
          });
        case 4:
          return _context.a(2);
      }
    }, _callee);
  }));
  return function playChord(_x) {
    return _ref.apply(this, arguments);
  };
}();
var ChordBlock = function ChordBlock(_ref2) {
  var instrument = _ref2.instrument,
    position = _ref2.position,
    name = _ref2.name,
    isPiano = _ref2.isPiano;
  if (!position) {
    return null;
  }
  var handlePlayClick = function handlePlayClick(e) {
    e.stopPropagation();
    e.preventDefault();
    playChord(position);
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "chord-container flex flex-col items-center text-center",
    style: {
      display: 'ruby'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "flex justify-center items-center mb-2"
  }, /*#__PURE__*/_react["default"].createElement("h4", {
    className: "text-base font-normal mr-2 h-8 flex items-center"
  }, name), position.midi && position.midi.length > 0 && /*#__PURE__*/_react["default"].createElement("button", {
    onClick: handlePlayClick,
    "aria-label": "Tocar acorde",
    className: "cursor-pointer border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200"
  }, /*#__PURE__*/_react["default"].createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 10 10"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: "M 2 1 L 2 9 L 8 5 Z",
    fill: "#444"
  })))), /*#__PURE__*/_react["default"].createElement(_["default"], {
    instrument: instrument,
    chord: position
  }));
};
ChordBlock.propTypes = {
  instrument: _propTypes["default"].object.isRequired,
  position: _propTypes["default"].object.isRequired,
  name: _propTypes["default"].string.isRequired,
  isPiano: _propTypes["default"].bool
};
ChordBlock.defaultProps = {
  isPiano: false
};
var _default = exports["default"] = ChordBlock;