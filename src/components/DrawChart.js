import React, { Component } from "react";
import * as d3 from "d3";
import { color } from "d3";

export const DrawChart = props => {
  // const dataset = new Array(props.dataset.length).fill({})
  const preset = [
    { value: 79740, name: "Last Man Standing" },
    { value: 79740, name: "Last Man Standing" },
    { value: 79740, name: "Last Man Standing" },
    { value: 79740, name: "Last Man Standing" },
    { value: 79740, name: "Last Man Standing" },
    { value: 79740, name: "Last Man Standing" }
  ];
  const { dataset, counter } = props;

  const width = window.innerWidth / 2 - 100;
  const height = window.innerHeight;
  let maxDomain = 480 * 365;

  const xScale = d3
    .scaleLinear()
    .domain([0, maxDomain])
    .range([0, width / 2]);

  const xScale2 = d3
    .scaleLinear()
    .domain([0, maxDomain])
    .range([0, width]);

  const chart = d3
    .select(".chart")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(50,0)");
  // .call(
  //   d3.zoom().on("zoom", () => {
  //     chart.attr("transform", d3.event.transform);
  //   })
  // );

  const nodesGroup = chart
    .select(".groupNodes")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const ref = chart
    .select(".year-circle")
    .select(".var")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("fill", "#e0e0e0")
    .style("opacity", 0.5)
    .attr("r", xScale(maxDomain));

  chart
    .select(".year-circle")
    .select(".fix")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("fill", "#e0e0e0")
    .style("opacity", 0.2)
    .attr("r", xScale(maxDomain));

  chart
    .select(".year-rect")
    .select(".rect-fix")
    .attr("x", 10)
    .attr("y", 100)
    .attr("width", width)
    .attr("height", 10)
    .attr("fill", "#e0e0e0");

  const rectVar = chart
    .select(".year-rect")
    .select(".rect-var")
    .attr("x", 10)
    .attr("y", 100)
    .attr("height", 10)
    .attr("fill", "blue");

  const color = d3
    .scaleLinear()
    .domain([1040, 10080, 43200])
    .range(["red", "#ddd", "blue"]);

  function drawNodes(dataset, maxDomain) {
    rectVar
      .transition()
      .duration(500)
      .attr("width", xScale2(counter));

    ref
      .transition()
      .duration(500)
      .attr("r", xScale(maxDomain - counter));

    const simulation = d3
      .forceSimulation(dataset)
      .force(
        "collide",
        d3.forceCollide().radius(d => xScale(d.value))
      )
      // .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(0, 0))

      .on("tick", ticked);

    function ticked() {
      const nodes = nodesGroup.selectAll("circle").data(dataset);

      nodes
        .enter()
        .append("circle")
        .attr("r", d => xScale(d.value))
        .merge(nodes)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", d => color(d.value))
        .style("opacity", 0.5)
        .attr("class", d => d.name)
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      nodes.exit().remove();
      simulation.restart();
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0.03);
      d.fx = null;
      d.fy = null;
    }
  }

  drawNodes(dataset, maxDomain);
  // drawNodes(preset, maxDomain);

  return null;
};
