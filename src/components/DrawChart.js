import * as d3 from "d3";
import { observer, inject } from "mobx-react";
import { cloneDeep } from "lodash";
import { timeConvert } from "./utils";

const width = window.innerWidth;
const height = window.innerHeight;
const maxDomain = 1440 * 365;

function generateLinearGradient() {
  const linearGradient = d3
    .select("svg")
    .append("radialGradient")
    .attr("id", "linear-gradient");

  linearGradient
    .append("stop")
    .attr("offset", "12%")
    .attr("stop-color", "#111");

  linearGradient
    .append("stop")
    .attr("offset", "35%")
    .attr("stop-color", "darkblue");

  linearGradient
    .append("stop")
    .attr("offset", "90%")
    .attr("stop-color", "blue");

  linearGradient
    .append("stop")
    .attr("offset", "95%")
    .attr("stop-color", "#111");
}

export const DrawChart = inject("state")(
  observer(function DrawChart({ state }) {
    const datasetMutable = cloneDeep(state.dataset);
    const useLessVarJustRestartAnimation = [
      state.isChartVisible,
      state.isListVisible,
      state.isCircleVisible,
      state.isHomeVisible,
      state.isSquareVisible
    ];

    generateLinearGradient();

    const xScale = d3
      .scaleLinear()
      .domain([0, maxDomain])
      .range([0, width / 2]);

    const zoom = d3
      .zoom()
      .scaleExtent([0.4, width])
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
      d3.select(".zoom-layer").style(
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
      .style("opacity", 0)
      .attr("r", xScale(maxDomain))
      .call(zoom);

    if (width < 500) {
      ref.call(zoom.transform, d3.zoomIdentity.scale(0.9));
    } else {
      ref.call(zoom.transform, d3.zoomIdentity.scale(0.5));
    }

    chart
      .select(".year-circle")
      .select(".fix")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("fill", "url(#linear-gradient)")
      .style("opacity", 1)
      .attr("r", xScale(maxDomain));

    chart.select(".zoom-layer").style("transform-origin", "50% 44% 0");

    const color = d3
      .scaleLinear()
      .domain([1040, 10080, maxDomain / 10])
      .range(["white", "white", "white"]);

    function drawNodes(dataset, maxDomain) {
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
        .force(
          "forceX",
          d3
            .forceX()
            .strength(0.1)
            .x(0)
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
            const {
              monthsCounter,
              daysCounter,
              hoursCounter,
              minutesCounter
            } = timeConvert(d.value, state.option);

            tooltip
              .transition()
              .duration(200)
              .style("opacity", 1);
            tooltip
              .style("left", d3.event.pageX + 20 + "px")
              .style("top", d3.event.pageY - 37 + "px")
              .style("background", "white")
              .style("box-shadow", "2px 2px 16px blue");

            tooltip
              .select(".text-tooltip")
              .html(
                `${d.name} ${monthsCounter > 0 ? monthsCounter + "month" : ""}
              ${daysCounter > 0 ? daysCounter + "day" : ""}
              ${hoursCounter > 0 ? hoursCounter + "hours" : ""}
              ${minutesCounter}min `
              )
              .style("color", "black");
          })
          .on("mouseleave", d => {
            tooltip.style("opacity", 0);
            tooltip.select(".text-tooltip").html("");
          });

        nodes.exit().remove();
        simulation.restart();
      }

      simulation.restart();
    }

    drawNodes(datasetMutable, maxDomain);

    return null;
  })
);
