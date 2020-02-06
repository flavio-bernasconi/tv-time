import React, { Component } from "react";
import * as d3 from "d3";
import { color } from "d3";

export const DrawChart = props => {
  // const dataset = new Array(props.dataset.length).fill({})
  const preset = [
    { value: 23000, name: "Last Man Standing" },
    { value: 23000, name: "Last Man Standing" },
    { value: 3000, name: "Last Man Standing" },
    { value: 23000, name: "Last Man Standing" },
    { value: 23000, name: "Last Man Standing" },
    { value: 23000, name: "Last Man Standing" },
    { value: 43000, name: "Last Man Standing" },
    { value: 53000, name: "Last Man Standing" }
  ];
  const { dataset, counter, hoursOfSleep } = props;
  console.log(hoursOfSleep);

  const width = window.innerWidth / 2 - 100;
  const height = window.innerHeight;
  const maxDomain = (1440 - hoursOfSleep) * 365; //a day
  const yearCircle = counter; //a day

  console.log(maxDomain);

  const chart = d3
    .select(".chart")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(50,0)");

  const nodesGroup = chart
    .select(".groupNodes")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const xScale = d3
    .scaleLinear()
    .domain([0, maxDomain])
    .range([0, width / 2]);

  const ref = chart
    .select(".year-circle")
    .select("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("fill", "#e0e0e0")
    .style("opacity", 0.5)
    .attr("r", 0);

  ref
    .transition()
    .duration(1000)
    .attr("r", xScale(maxDomain));

  const color = d3
    .scaleLinear()
    .domain([1040, 10080, 43200])
    .range(["red", "#ddd", "blue"]);

  function drawNodes(dataset) {
    const simulation = d3
      .forceSimulation(dataset)
      .force(
        "collide",
        d3.forceCollide(10).radius(d => xScale(d.value))
      )
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
        .attr("fill", d => color(d.value));

      nodes.exit().remove();
    }

    simulation.restart();
  }

  // drawNodes(preset);
  drawNodes(dataset);

  return null;
};
