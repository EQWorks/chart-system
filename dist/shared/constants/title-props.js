"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.titleDefaultProps = exports.titlePropTypes = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var titlePropTypes = {
  title: _propTypes.default.string,
  titleStyle: _propTypes.default.shape({
    color: _propTypes.default.string.isRequired,
    fontSize: _propTypes.default.string.isRequired,
    fontWeight: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
    textAlign: _propTypes.default.string.isRequired
  })
};
exports.titlePropTypes = titlePropTypes;
var titleDefaultProps = {
  title: '',
  titleStyle: {
    color: 'black',
    fontSize: '18px',
    fontWeight: 'normal',
    textAlign: 'left'
  }
};
exports.titleDefaultProps = titleDefaultProps;