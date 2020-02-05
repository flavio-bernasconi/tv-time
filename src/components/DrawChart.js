import React, { Component } from "react";
import * as d3 from "d3";
import { color } from "d3";

export const DrawChart = props => {
  // const dataset = new Array(props.dataset.length).fill({})
  const { dataset } = props;
  console.log(dataset);

  const width = window.innerWidth / 2 - 100;
  const height = window.innerHeight;
  const maxDomain = 1440 * 365; //a day

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

  chart
    .select(".year-circle")
    .select("circle")
    .attr("r", xScale(maxDomain))
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("fill", "#e0e0e0")
    .style("opacity", 0.5);

  const color = d3
    .scaleLinear()
    .domain([1040, 10080, 43200])
    .range(["red", "#ddd", "blue"]);

  function drawNodes(dataset) {
    const simulation = d3
      .forceSimulation(dataset)
      // .force("charge", d3.forceManyBody())
      .force(
        "collide",
        d3.forceCollide(10).radius(d => xScale(d.value))
      )
      // .force("center", d3.forceCenter(width / 2, height / 2))
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

  drawNodes(dataset);

  // function yearNodes(days) {
  //   const arrYear = new Array(7).fill(0);

  //   const refCirc = ref.selectAll("circle").data(arrYear);

  //   refCirc
  //     .join("circle")
  //     .attr("r", 4)
  //     .attr("cy", (d, i) => Math.random() * 500)
  //     .attr("cx", (d, i) => Math.random() * 500)
  //     .attr("key", (d, i) => i)
  //     .attr("fill", (d, i) => (i < 365 - days ? "black" : "red"));

  //   refCirc.exit().remove();
  // }

  // yearNodes(daysCounter)

  // var data = {
  //   name: "A1",
  //   children: [
  //     {
  //       name: "B1",
  //       children: [
  //         {
  //           name: "C1",
  //           value: 100
  //         },
  //         {
  //           name: "C2",
  //           value: 300
  //         },
  //         {
  //           name: "C3",
  //           value: 200
  //         }
  //       ]
  //     }
  //   ]
  // };

  // console.log(dataset);

  // console.log(data);

  // function draw(data) {
  //   const root = d3.hierarchy(data);

  //   const packLayout = d3.pack();

  //   packLayout.size([width, height]);

  //   root.sum(function(d) {
  //     return d.value;
  //   });

  //   packLayout(root);

  //   d3.select("svg g")
  //     .selectAll("circle")
  //     .data(root.descendants())
  //     .enter()
  //     .append("circle")
  //     .attr("cx", function(d) {
  //       return d.x;
  //     })
  //     .attr("cy", function(d) {
  //       return d.y;
  //     })
  //     .attr("r", function(d) {
  //       console.log(d);
  //       return d.value;
  //     })
  //     .style("opacity", 0.5);
  // }

  // draw(data);

  return <div></div>;
};
