"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _shape = require("@visx/shape");

var _group = require("@visx/group");

var _scale = require("@visx/scale");

var margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
};

var renderPie = function renderPie(data, config, pie) {
  //TODO: add text auto color contrast
  var item = config.dataKey.item,
      colorRange = config.colorRange;
  var pieColor = (0, _scale.scaleOrdinal)({
    domain: data.map(function (d) {
      return d.item;
    }),
    range: colorRange
  });
  return pie.arcs.map(function (arc, index) {
    var _pie$path$centroid = pie.path.centroid(arc),
        _pie$path$centroid2 = (0, _slicedToArray2.default)(_pie$path$centroid, 2),
        centroidX = _pie$path$centroid2[0],
        centroidY = _pie$path$centroid2[1];

    var hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
    var arcPath = pie.path(arc);
    var arcFill = pieColor(arc.data[item]);
    return /*#__PURE__*/_react.default.createElement("g", {
      key: "arc-".concat(index)
    }, /*#__PURE__*/_react.default.createElement("path", {
      d: arcPath,
      fill: arcFill
    }), hasSpaceForLabel && /*#__PURE__*/_react.default.createElement("text", {
      x: centroidX,
      y: centroidY,
      dy: ".33em",
      fill: "#ffffff",
      fontSize: 12,
      textAnchor: "middle",
      pointerEvents: "none"
    }, arc.data[item]));
  });
};

var Pie = function Pie(_ref) {
  var data = _ref.data,
      width = _ref.width,
      height = _ref.height,
      config = _ref.config;
  var dataKey = config.dataKey;
  var innerWidth = width - margin.left - margin.right;
  var innerHeight = height - margin.top - margin.bottom;
  var radius = Math.min(innerWidth, innerHeight) / 2;
  var centerY = innerHeight / 2;
  var centerX = innerWidth / 2;
  var top = centerY + margin.top;
  var left = centerX + margin.left;
  return /*#__PURE__*/_react.default.createElement("svg", {
    width: width,
    height: height
  }, /*#__PURE__*/_react.default.createElement(_group.Group, {
    top: top,
    left: left
  }, /*#__PURE__*/_react.default.createElement(_shape.Pie, {
    data: data,
    pieValue: function pieValue(d) {
      return d[dataKey.value];
    },
    outerRadius: radius
  }, function (pie) {
    return renderPie(data, config, pie);
  })));
};

Pie.propTypes = {
  config: _propTypes.default.object.isRequired,
  data: _propTypes.default.array.isRequired,
  height: _propTypes.default.number.isRequired,
  width: _propTypes.default.number.isRequired
};
var _default = Pie;
exports.default = _default;