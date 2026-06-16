"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Neck = _interopRequireDefault(require("./Neck"));
var _Dot = _interopRequireDefault(require("./Dot"));
var _Barre = _interopRequireDefault(require("./Barre"));
var _Piano = _interopRequireDefault(require("./Piano"));
var _propTypes2 = require("./propTypes");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var onlyDots = function onlyDots(chord) {
  return chord.frets.map(function (f, index) {
    return {
      position: index,
      value: f
    };
  }).filter(function (f) {
    return !chord.barres || chord.barres.indexOf(f.value) === -1;
  });
};
var getViewBoxHeight = function getViewBoxHeight(instrument) {
  return instrument.name === 'Piano' ? 70 : instrument.fretsOnChord * 12 + 22;
};
var getFretsOnChord = function getFretsOnChord(instrument, chord) {
  return Math.max.apply(Math, [instrument.fretsOnChord].concat(_toConsumableArray(chord.frets.filter(function (fret) {
    return fret > 0;
  }))));
};
var Chord = function Chord(_ref) {
  var chord = _ref.chord,
    instrument = _ref.instrument,
    lite = _ref.lite;
  if (!chord || !chord.frets) return null;
  var fretsOnChord = instrument.name === 'Piano' ? instrument.fretsOnChord : getFretsOnChord(instrument, chord);
  var renderedInstrument = _objectSpread(_objectSpread({}, instrument), {}, {
    fretsOnChord: fretsOnChord
  });
  return /*#__PURE__*/_react["default"].createElement("svg", {
    width: "100%",
    xmlns: "http://www.w3.org/2000/svg",
    preserveAspectRatio: "xMinYMin meet",
    viewBox: "0 0 80 ".concat(getViewBoxHeight(renderedInstrument))
  }, instrument.name === 'Piano' ? /*#__PURE__*/_react["default"].createElement("g", {
    transform: "translate(5, 13)"
  }, /*#__PURE__*/_react["default"].createElement(_Piano["default"], {
    chord: chord,
    lite: lite
  })) : /*#__PURE__*/_react["default"].createElement("g", {
    transform: "translate(13, 13)"
  }, /*#__PURE__*/_react["default"].createElement(_Neck["default"], {
    tuning: instrument.tunings.standard,
    strings: instrument.strings,
    frets: chord.frets,
    capo: chord.capo,
    fretsOnChord: fretsOnChord,
    baseFret: chord.baseFret,
    lite: lite
  }), chord.barres && chord.barres.map(function (barre, index) {
    return /*#__PURE__*/_react["default"].createElement(_Barre["default"], {
      key: index,
      capo: index === 0 && chord.capo,
      barre: barre,
      finger: chord.fingers && chord.fingers[chord.frets.indexOf(barre)],
      frets: chord.frets,
      lite: lite
    });
  }), onlyDots(chord).map(function (fret) {
    return /*#__PURE__*/_react["default"].createElement(_Dot["default"], {
      key: fret.position,
      string: instrument.strings - fret.position,
      fret: fret.value,
      strings: instrument.strings,
      finger: chord.fingers && chord.fingers[fret.position],
      lite: lite
    });
  })));
};
Chord.propTypes = {
  chord: _propTypes["default"].any,
  instrument: _propTypes2.instrumentPropTypes,
  lite: _propTypes["default"].bool
};
Chord.defaultProps = {
  lite: false
};
var _default = exports["default"] = Chord;