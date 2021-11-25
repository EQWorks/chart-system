"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

var radiusMin = 5;
var radiusMax = 15;
var start = 0;

var Cluster = function Cluster(_ref) {
  var width = _ref.width,
      height = _ref.height,
      data = _ref.data,
      config = _ref.config;
  var dataKey = config.dataKey,
      color = config.color,
      currentGroup = config.currentGroup,
      tooltip = config.tooltip,
      clusterMaxLength = config.clusterMaxLength,
      mode = config.mode;
  var end = clusterMaxLength > 0 ? clusterMaxLength : data.length;
  var clusters = (0, _react.useMemo)(function () {
    return data.sort(function (a, b) {
      return d3.descending(a[dataKey.radius], b[dataKey.radius]);
    }).slice(start, end);
  }, [data, dataKey.radius, end]);
  var selected = clusters.map(function (d) {
    return d[dataKey.radius];
  });
  var rScale = d3.scaleLinear().domain(d3.extent(selected)).range([radiusMin, radiusMax]);
  var svgRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (svgRef.current !== null && width > 0 && height > 0) {
      var nodeList = clusters.map(function (el) {
        var ids = el[dataKey.node];

        if (mode.showCommonNodes) {
          var first = ids.includes(mode.groups[0]);
          var second = ids.includes(mode.groups[1]);
          return first && second ? [2] : first && !second ? [1] : [3];
        } else {
          return ids.includes(currentGroup) ? [1] : [2];
        }
      });

      var ticked = function ticked() {
        node.attr('cx', function (d) {
          return d.x;
        }).attr('cy', function (d) {
          return d.y;
        });
        hull1.attr('class', 'hull').style('stroke-width', 40).style('stroke', color).style('fill', color).style('opacity', 0.2).style('stroke-linejoin', 'round');
      };

      var svg = d3.select(svgRef.current);
      svg.selectAll('.nodes').remove();
      svg.selectAll('.hull').remove();
      var xCenter = mode.showCommonNodes ? [width / 5 * 2, width / 5 * 3, width / 5 * 4] : [width / 5 * 2, width / 5 * 4];
      d3.forceSimulation(nodeList).force('charge', d3.forceManyBody().strength(-10)).force('collide', d3.forceCollide().radius(function (_, i) {
        return rScale(selected[i]) + 2.5;
      })).force('center', d3.forceCenter(width / 2, height / 2)).force('x', d3.forceX().x(function (d) {
        return xCenter[d - 1];
      })).force('y', d3.forceY().y(height / 2)).on('tick', ticked);
      var node = svg.append('g').attr('class', 'nodes').selectAll('circle').data(nodeList).enter().append('circle').attr('r', function (_, i) {
        return rScale(selected[i]);
      }).attr('fill', function (d) {
        if (mode.showCommonNodes) {
          var colors = mode.colors;
          return d.includes(1) ? colors[0] : d.includes(2) ? colors[1] : colors[2];
        } else {
          return d.includes(1) ? color : '#cdcdcd';
        }
      });
      var hull1 = svg.append('path').datum([nodeList]).attr('pointer-events', 'none');
      var tooltipLayer = d3.selectAll('.tooltip');
      node.on('mouseover', function (evt, node) {
        tooltipLayer.style('visibility', 'visible').html("\n          <p><b>".concat(data[node.index][tooltip.dataKey], "</b></p>\n          <p>").concat(dataKey.radius, ": ").concat(selected[node.index], "</p>\n          ")).style('left', evt.offsetX + 50 + 'px').style('top', evt.offsetY + 50 + 'px');
      }).on('mouseout', function () {
        tooltipLayer.style('visibility', 'hidden').selectAll('p').remove();
      });
    }
  }, [svgRef.current, clusters, currentGroup]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("svg", {
    ref: svgRef,
    width: width,
    height: height
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "tooltip",
    style: tooltip.style
  }));
};

Cluster.propTypes = {
  clusterMaxLength: _propTypes.default.number,
  config: _propTypes.default.shape({
    clusterMaxLength: _propTypes.default.number,
    color: _propTypes.default.string,
    currentGroup: _propTypes.default.number,
    dataKey: _propTypes.default.shape({
      node: _propTypes.default.string,
      radius: _propTypes.default.string
    }),
    mode: _propTypes.default.shape({
      colors: _propTypes.default.any,
      groups: _propTypes.default.any,
      showCommonNodes: _propTypes.default.any
    }),
    tooltip: _propTypes.default.shape({
      dataKey: _propTypes.default.any,
      style: _propTypes.default.any
    })
  }),
  data: _propTypes.default.array,
  height: _propTypes.default.number,
  width: _propTypes.default.number
};
Cluster.defaultProps = {
  clusterMaxLength: 0,
  mode: {
    colors: ['#a9ff91', '#4278ff', '#dc91ff'],
    showCommonNodes: false
  }
};

var _default = /*#__PURE__*/_react.default.memo(Cluster);

exports.default = _default;