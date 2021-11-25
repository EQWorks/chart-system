"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _chartProps = require("../shared/constants/chart-props");

var _goober = require("goober");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

(0, _goober.setup)(_react.default.createElement); // [TODO] - investigate why padding and box-shadow styles are not applied properly in all charts

var TooltipWrapper = (0, _goober.styled)('div')(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  border-radius: 4px;\n  background-color: #ffffff;\n  padding: ", ";\n  box-shadow: ", ";\n"])), function (_ref) {
  var charttype = _ref.charttype;
  return ['line', 'scatter'].includes(charttype) ? '10px' : '2px';
}, function (_ref2) {
  var charttype = _ref2.charttype;
  return ['line', 'scatter'].includes(charttype) ? '0 2px 8px 0 rgba(12, 12, 13, 0.15)' : "'0 2px 8px 0 rgba(12, 12, 13, 0.15)'";
});
var TooltipHeader = (0, _goober.styled)('div')(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)([""])));
var TooltipBody = (0, _goober.styled)('div')(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: column;\n  margin-left: ", ";\n"])), function (_ref3) {
  var notitle = _ref3.notitle;
  return notitle ? '0' : '14px';
});
var TooltipNode = (0, _goober.styled)('div')(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  height: 8px;\n  width: 8px;\n  border-radius: 50%;\n  display: inline-block;\n  margin-right: 6px;\n  background-color: ", ";\n"])), function (props) {
  return props['background-color'];
});
var TooltipLabel = (0, _goober.styled)('strong')(function (_ref4) {
  var _ref4$typography = _ref4.typography,
      typography = _ref4$typography === void 0 ? _chartProps.typographyDefaultProps.typographyProps : _ref4$typography;
  return "\n  font-family: ".concat(typography.fontFamily, ";\n  font-size: ").concat(typography.fontSize, "px;\n");
});
var TooltipData = (0, _goober.styled)('span')(function (_ref5) {
  var _ref5$typography = _ref5.typography,
      typography = _ref5$typography === void 0 ? _chartProps.typographyDefaultProps.typographyProps : _ref5$typography;
  return "\n  font-family: ".concat(typography.fontFamily, ";\n  font-size: ").concat(typography.fontSize, "px;\n");
});
var propTypes = {
  label: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
  color: _propTypes.default.string.isRequired,
  display: _propTypes.default.arrayOf(_propTypes.default.shape({
    label: _propTypes.default.string.isRequired,
    value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired
  })),
  disableTooltipTitle: _propTypes.default.bool,
  chartType: _propTypes.default.string.isRequired,
  typography: _chartProps.typographyPropTypes.typographyProps
};

var Tooltip = function Tooltip(_ref6) {
  var label = _ref6.label,
      color = _ref6.color,
      display = _ref6.display,
      disableTooltipTitle = _ref6.disableTooltipTitle,
      chartType = _ref6.chartType,
      typography = _ref6.typography;
  return /*#__PURE__*/_react.default.createElement(TooltipWrapper, {
    charttype: chartType
  }, !disableTooltipTitle && /*#__PURE__*/_react.default.createElement(TooltipHeader, null, /*#__PURE__*/_react.default.createElement(TooltipNode, {
    "background-color": color
  }), /*#__PURE__*/_react.default.createElement(TooltipLabel, {
    typography: typography
  }, label)), /*#__PURE__*/_react.default.createElement(TooltipBody, {
    notitle: disableTooltipTitle.toString()
  }, display.map(function (_ref7) {
    var label = _ref7.label,
        value = _ref7.value;
    return /*#__PURE__*/_react.default.createElement(TooltipData, {
      key: label,
      typography: typography
    }, label, ": ", value);
  })));
};

Tooltip.propTypes = propTypes;
Tooltip.defaultprops = _chartProps.typographyDefaultProps;
var _default = Tooltip;
exports.default = _default;