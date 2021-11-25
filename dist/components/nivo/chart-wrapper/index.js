"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.withWrapper = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _titleProps = require("../shared/constants/title-props");

var _chartProps = require("../shared/constants/chart-props");

var _goober = require("goober");

var _core = require("@nivo/core");

var _templateObject;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

(0, _goober.setup)(_react.default.createElement);
var Wrapper = (0, _goober.styled)('div')(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  height: 100%;\n  margin: 16px;\n"])));
var Title = (0, _goober.styled)('div', _react.forwardRef)(function (_ref) {
  var _ref$typography = _ref.typography,
      typography = _ref$typography === void 0 ? _titleProps.titleDefaultProps.titleStyle : _ref$typography;
  return "\n  font-family: ".concat(typography.fontFamily, ";\n  font-size: ").concat(typography.fontSize, ";\n  font-weight: ").concat(typography.fontWeight, ";\n  color: ").concat(typography.color, ";\n  text-align: ").concat(typography.textAlign, ";\n  margin-bottom: 16px;\n  overflow-wrap: anywhere;\n");
});

var withWrapper = function withWrapper(Chart) {
  var ChartWrapper = function ChartWrapper(_ref2) {
    var title = _ref2.title,
        titleStyle = _ref2.titleStyle,
        typographyProps = _ref2.typographyProps,
        chartProps = (0, _objectWithoutProperties2.default)(_ref2, ["title", "titleStyle", "typographyProps"]);
    var titleRef = (0, _react.useRef)();
    return /*#__PURE__*/_react.default.createElement(Wrapper, null, title.length !== 0 && /*#__PURE__*/_react.default.createElement(Title, {
      ref: titleRef,
      typography: _objectSpread({
        fontFamily: typographyProps.fontFamily
      }, titleStyle)
    }, title), /*#__PURE__*/_react.default.createElement(_core.ResponsiveWrapper, null, function (_ref3) {
      var height = _ref3.height,
          width = _ref3.width;
      return /*#__PURE__*/_react.default.createElement(Chart
      /**
       * because we have 16px margin and height 100% for Wrapper, the height overflows the container with 32px
       * for chart we have to substract the top and bottom Wrapper margins plus the bottom title margin (16px)
       */
      , (0, _extends2.default)({
        height: height - (title.length !== 0 && titleRef.current ? titleRef.current.getBoundingClientRect().height + 32 + 16 : 32),
        width: width,
        typographyProps: typographyProps
      }, chartProps));
    }));
  };

  ChartWrapper.propTypes = _objectSpread(_objectSpread({}, _titleProps.titlePropTypes), _chartProps.typographyPropTypes);
  ChartWrapper.defaultProps = _objectSpread(_objectSpread({}, _titleProps.titleDefaultProps), _chartProps.typographyDefaultProps);
  return ChartWrapper;
};

exports.withWrapper = withWrapper;
var _default = withWrapper;
exports.default = _default;