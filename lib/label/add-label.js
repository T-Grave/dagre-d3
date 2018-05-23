var addTextLabel = require('./add-text-label'),
  addHtmlLabel = require('./add-html-label'),
  addSVGLabel = require('./add-svg-label');

module.exports = addLabel;

function addLabel(root, node) {
  const { label, clusterLabelPos: location, paddingTop = 0, paddingBottom = 0 } = node;

  var labelSvg = root.append('g');

  // Allow the label to be a string, a function that returns a DOM element, or
  // a DOM element itself.
  if (node.labelType === 'svg') {
    addSVGLabel(labelSvg, node);
  } else if (typeof label !== 'string' || node.labelType === 'html') {
    addHtmlLabel(labelSvg, node);
  } else {
    addTextLabel(labelSvg, node);
  }

  var labelBBox = labelSvg.node().getBBox();
  var y;
  switch (location) {
    case 'top':
      y = -node.height / 2 + paddingTop;
      break;
    case 'bottom':
      y = node.height / 2 - labelBBox.height - paddingBottom;
      break;
    default:
      y = -labelBBox.height / 2;
  }
  labelSvg.attr('transform', 'translate(' + -labelBBox.width / 2 + ',' + y + ')');

  return labelSvg;
}
