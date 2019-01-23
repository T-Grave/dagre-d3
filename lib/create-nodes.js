"use strict";

var _ = require("lodash"),
    util = require("./util"),
    d3 = require("d3");

module.exports = createNodes;

function createNodes(selection, g, shapes) {
  var simpleNodes = g.nodes().filter(function(v) { return !util.isSubgraph(g, v); });
  var svgNodes = selection.selectAll("g.node")
    .data(simpleNodes, function(v) { return v; })
    .classed("update", true);

  svgNodes.selectAll("*").remove();

  svgNodes.enter()
    .append("g")
      .attr("class", "node")
      .style("opacity", 0);

  svgNodes = selection.selectAll("g.node"); 

  svgNodes.each(function(v) {
    var node = g.node(v),
        thisGroup = d3.select(this);
    util.applyClass(thisGroup, node["class"],
      (thisGroup.classed("update") ? "update " : "") + "node");
    var
        shape = shapes[node.shape],
        bbox = _.pick(node, "width", "height");

    node.elem = this;

    if (node.id) { thisGroup.attr("id", node.id); }


    bbox.width += node.paddingLeft + node.paddingRight;
    bbox.height += node.paddingTop + node.paddingBottom;

    var shapeSvg = shape(d3.select(this), bbox, node);
    util.applyStyle(shapeSvg, node.style);

    var shapeBBox = shapeSvg.node().getBBox();
    node.width = shapeBBox.width;
    node.height = shapeBBox.height;
  });

  util.applyTransition(svgNodes.exit(), g)
    .style("opacity", 0)
    .remove();

  return svgNodes;
}
