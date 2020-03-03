import * as d3 from "d3";
import { observer, inject } from "mobx-react";
import { cloneDeep } from "lodash";

const width = window.innerWidth;
const height = window.innerHeight;
const maxDomain = 1440 * 365;

export const DrawChart = inject("state")(
  observer(function DrawChart({ state }) {
    const datasetMutable = cloneDeep(state.dataset);

    const xScale = d3
      .scaleLinear()
      .domain([0, maxDomain])
      .range([0, width / 2]);

    const xScale2 = d3
      .scaleLinear()
      .domain([0, maxDomain])
      .range([0, width]);

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, width])
      .on("zoom", zoomFn);

    const chart = d3
      .select(".chart")
      .attr("width", width)
      .attr("height", height);

    d3.select(".zoom-layer")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "scale(0.5)");

    function zoomFn() {
      d3.select(".chart").style(
        "transform",
        "scale(" + d3.event.transform.k + ")"
      );
    }

    const tooltip = d3.select(".tooltip").style("opacity", 0);

    const nodesGroup = chart
      .select(".groupNodes")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const ref = chart
      .select(".year-circle")
      .select(".var")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("fill", "#e0e0e0")
      .style("opacity", 0)
      .attr("r", xScale(maxDomain))
      .call(zoom);

    chart
      .select(".year-circle")
      .select(".fix")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("fill", "#e0e0e0")
      .style("opacity", 0.2)
      .attr("r", xScale(maxDomain));

    chart.select(".zoom-layer").style("transform-origin", "50% 50% 0");

    chart
      .select(".year-rect")
      .select(".rect-fix")
      .attr("x", 0)
      .attr("y", -60)
      .attr("width", width)
      .attr("height", 10)
      .attr("fill", "#e0e0e0");

    const rectVar = chart
      .select(".year-rect")
      .select(".rect-var")
      .attr("x", 0)
      .attr("y", -60)
      .attr("height", 10)
      .attr("fill", "blue");

    const color = d3
      .scaleLinear()
      .domain([1040, 10080, maxDomain / 10])
      .range(["white", "blue", "darkblue"]);

    function drawNodes(dataset, maxDomain) {
      rectVar
        .transition()
        .duration(500)
        .attr("width", xScale2(state.counter));

      ref
        .transition()
        .duration(500)
        .attr("r", xScale(maxDomain - state.counter));

      const simulation = d3
        .forceSimulation(dataset)
        .force(
          "collide",
          d3.forceCollide().radius(d => xScale(d.value) + 5)
        )
        .force("center", d3.forceCenter(0, 0))
        .alphaDecay(0.005)
        .velocityDecay(0.9)
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
          .style("opacity", 1)
          .attr("class", d => d.name)
          .on("mouseenter", d => {
            tooltip
              .transition()
              .duration(200)
              .style("opacity", 1);
            tooltip
              .style("left", d3.event.pageX + 20 + "px")
              .style("top", d3.event.pageY - 37 + "px")
              .style("background", "white");

            tooltip
              .select(".text-tooltip")
              .html(d.name)
              .style("color", "black");
          })
          .on("mouseleave", d => {
            tooltip.style("opacity", 0);
            tooltip.select(".text-tooltip").html("");
          });
        nodes.exit().remove();
        simulation.restart();
      }
    }

    drawNodes(datasetMutable, maxDomain);

    return null;
  })
);
