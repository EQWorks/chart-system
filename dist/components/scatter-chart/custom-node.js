"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var propTypes = {
  node: _propTypes.default.object,
  id: _propTypes.default.string,
  x: _propTypes.default.number,
  y: _propTypes.default.number,
  size: _propTypes.default.number,
  color: _propTypes.default.string,
  blendMode: _propTypes.default.string,
  onMouseEnter: _propTypes.default.func,
  onMouseMove: _propTypes.default.func,
  onMouseLeave: _propTypes.default.func,
  onClick: _propTypes.default.func
};

var CustomNode = function CustomNode(_ref) {
  var node = _ref.node,
      x = _ref.x,
      y = _ref.y,
      size = _ref.size,
      color = _ref.color,
      blendMode = _ref.blendMode,
      onMouseEnter = _ref.onMouseEnter,
      onMouseMove = _ref.onMouseMove,
      onMouseLeave = _ref.onMouseLeave,
      onClick = _ref.onClick;
  return /*#__PURE__*/_react.default.createElement("g", {
    transform: "translate(".concat(x, ",").concat(y, ")")
  }, /*#__PURE__*/_react.default.createElement("circle", {
    r: size / 2,
    fill: color,
    id: node.data.serieId,
    style: {
      mixBlendMode: blendMode,
      opacity: 1
    },
    onMouseEnter: onMouseEnter,
    onMouseMove: onMouseMove,
    onMouseLeave: onMouseLeave,
    onClick: onClick
  }));
};

CustomNode.propTypes = propTypes;
var _default = CustomNode;
exports.default = _default;