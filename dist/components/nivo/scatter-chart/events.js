"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onMouseLeave = exports.onMouseEnter = void 0;

var _dimensions = require("../shared/constants/dimensions");

/**
 * onMouseEnter - defines action on mouse enter, highlighting the data set on which the cursor sets on
 * @param { HTMLElement } node - hovered node
 */
var onMouseEnter = function onMouseEnter(event, node) {
  var parentNode = node.target.parentNode.parentNode;
  var nodeId = node.target.id; // isolate circles from data sets that are not hovered and set their opacity

  Array.from(parentNode.children) // lighten all nonhovered data sets
  .forEach(function (ele) {
    if (ele.children[0].tagName === 'circle' && ele.children[0].getAttributeNode('id').value !== nodeId) {
      ele.children[0].style.opacity = _dimensions.DATA_HOVER_OPACITY;
    }
  });
};
/**
 * onMouseLeave - defines action on mouse leave, resetting the scatter chart data points to
 * default setting (opacity: 1)
 * @param { HTMLElement } node - hovered node
 */


exports.onMouseEnter = onMouseEnter;

var onMouseLeave = function onMouseLeave(event, node) {
  var parentNode = node.target.parentNode.parentNode;
  Array.from(parentNode.children).forEach(function (ele) {
    if (ele.children[0].tagName === 'circle') {
      ele.children[0].style.opacity = 1;
    }
  });
};

exports.onMouseLeave = onMouseLeave;