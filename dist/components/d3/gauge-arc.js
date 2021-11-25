"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

var GaugeArc = function GaugeArc(_ref) {
  var data = _ref.data,
      width = _ref.width,
      height = _ref.height,
      config = _ref.config;
  var color = config.color,
      backgroundColor = config.backgroundColor,
      dataKey = config.dataKey,
      transition = config.transition;
  var value = data[dataKey.x2] ? data[dataKey.x1] / data[dataKey.x2] * 100 : 0;
  var remainder = 100 - value;
  var colors = [color, backgroundColor];
  var svgRef = (0, _react.useRef)(null);
  var isAscending = value > remainder;
  var pieSize = width > height ? height / 2 : width / 2;
  var lineThickness = pieSize * 0.2;
  var arcsGenerator = d3.pie().sortValues(function (a, b) {
    return isAscending ? b - a : a - b;
  });
  var arcsData = (0, _react.useMemo)(function () {
    return arcsGenerator([value, remainder]);
  }, [value, remainder]);
  var arcPath = d3.arc().innerRadius(pieSize - lineThickness).outerRadius(pieSize).cornerRadius(lineThickness);

  var _d3$pie = d3.pie()([1.0]),
      _d3$pie2 = (0, _slicedToArray2.default)(_d3$pie, 1),
      backgroundPath = _d3$pie2[0];

  (0, _react.useEffect)(function () {
    if (svgRef.current !== null) {
      var svg = d3.select(svgRef.current);
      var gauge = svg.selectAll('.arcs').data(arcsData).attr('d', arcPath).attr('fill', function (_, i) {
        return colors[i];
      });

      if (transition.animation) {
        gauge.transition().duration(transition.duration).attrTween('d', function (d) {
          if (d.index === 1) {
            return; //deactivate tweening for the remainder value
          }

          var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
          return function (t) {
            d.endAngle = i(t);
            return arcPath(d);
          };
        });
      }
    }
  }, [svgRef.current, arcsData]);
  return /*#__PURE__*/_react.default.createElement("svg", {
    preserveAspectRatio: "xMidYMid meet",
    ref: svgRef,
    width: width,
    height: height
  }, /*#__PURE__*/_react.default.createElement("g", {
    transform: "translate(".concat(width / 2, " ").concat(height / 2, ")")
  }, /*#__PURE__*/_react.default.createElement("path", {
    id: "background",
    d: arcPath(backgroundPath),
    fill: backgroundColor
  }), arcsData.map(function (d, i) {
    return /*#__PURE__*/_react.default.createElement("path", {
      className: "arcs",
      key: i
    });
  }), /*#__PURE__*/_react.default.createElement("text", {
    style: {
      textAnchor: 'middle',
      dominantBaseline: 'middle',
      fontFamily: 'Open Sans',
      fontSize: '24px',
      fontWeight: 700
    }
  }, "".concat(value.toFixed(2), "%"))));
};

GaugeArc.propTypes = {
  backgroundColor: _propTypes.default.string,
  color: _propTypes.default.string,
  config: _propTypes.default.shape({
    backgroundColor: _propTypes.default.string,
    color: _propTypes.default.string,
    dataKey: _propTypes.default.shape({
      x1: _propTypes.default.string,
      x2: _propTypes.default.string
    }),
    transition: _propTypes.default.shape({
      animation: _propTypes.default.any,
      duration: _propTypes.default.any
    })
  }).isRequired,
  data: _propTypes.default.object.isRequired,
  height: _propTypes.default.number.isRequired,
  width: _propTypes.default.number.isRequired
};
GaugeArc.defaultProps = {
  color: '#0075FF',
  backgroundColor: '#cdcdcd',
  transition: {
    animation: false,
    duration: 0
  }
};

var _default = /*#__PURE__*/_react.default.memo(GaugeArc);

exports.default = _default;