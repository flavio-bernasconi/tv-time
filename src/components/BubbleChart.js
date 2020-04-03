import * as d3 from "d3";
import { observer, inject } from "mobx-react";
import { cloneDeep } from "lodash";
import { timeConvert } from "./utils";

const width = window.innerWidth;
const height = window.innerHeight - 200;
const maxDomain = 1440 * 365;

export const BubbleChart = inject("state")(
  observer(function BubbleChart({ state }) {
    const { dataset } = state;
    const nodesGroup = cloneDeep(dataset);

    const chart = d3
      .select(".bubbles")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", `translate(200,0)`);

    const areaChart = chart
      .select(".genres-nodes")
      .attr("width", width)
      .attr("height", height);

    const xScale = d3
      .scaleLinear()
      .domain([0, maxDomain])
      .range([0, width / 2]);

    const tooltip = d3.select(".tooltip").style("opacity", 0);

    //

    function drawBubble(nodesGroup) {
      const getAllGenres = {
        ...[nodesGroup.map(serie => serie.genre[0].replace(/ |&/g, ""))]
      };
      const uniqueGeneres = [...new Set(getAllGenres[0].flat())];

      const associateGenreToColor = {};

      uniqueGeneres.forEach((genre, i) => {
        return (associateGenreToColor[genre.replace(/ |&/g, "")] = i);
      });

      const nodesGroupByGenre = uniqueGeneres.map(genre => {
        return { [genre]: nodesGroup.filter(node => node.genre[0] === genre) };
      });

      const genresCenter = {};

      const xCenterScale = d3
        .scaleLinear()
        .domain([0, 3])
        .range([0, width]);

      const yCenterScale = d3
        .scaleLinear()
        .domain([0, 4])
        .range([0, height]);

      const colorGenre = d3
        .scaleSequential()
        .domain([0, uniqueGeneres.length + 1])
        .interpolator(d3["interpolateBlues"]);

      let rows = 1;
      let count = 0;

      function createYDistribution(index) {
        if (index !== 0 && index % 3 === 0) {
          rows += 1;
          count = 0;
        }

        count++;

        return { x: xCenterScale(count - 1), y: yCenterScale(rows) };
      }

      uniqueGeneres.forEach((genre, i) => {
        return (genresCenter[genre] = createYDistribution(i));
      });

      const valCenters = Object.entries(genresCenter).map(([label, val]) => [
        label,
        val.x,
        val.y
      ]);

      function sortArrWithReference(arrToSort, ref) {
        arrToSort.sort(function(a, b) {
          return ref.indexOf(a.genre[0]) - ref.indexOf(b.genre[0]);
        });
      }

      sortArrWithReference(nodesGroup, uniqueGeneres);

      function createGroupAndText(labels) {
        const foreignObject = areaChart
          .selectAll("foreignObject")
          .data(labels)
          .enter();

        foreignObject
          .append("foreignObject")
          .attr("class", d => d[0] + " foreign")
          .attr("x", d => d[1])
          .attr("y", d => d[2])
          .attr("height", 200)
          .attr("width", 200);
        // .style("background", d => "red");

        const group = areaChart
          .selectAll("g")
          .data(labels)
          .enter();

        group
          .append("g")
          .attr("class", d => d[0] + " genreSingle")
          .attr("x", d => d[1])
          .attr("height", 100);

        d3.selectAll("text").remove();

        labels.forEach(([label, x, y], i) => {
          d3.select(`.genreSingle.${label.replace(/ |&/g, "")}`)
            .append("text")
            .text(label)
            .attr("y", y - 50)
            .attr("x", x - 50)
            .attr("font-size", "16px")
            .attr("fill", d => colorGenre(i))
            .attr("width", 50)
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1);
        });
      }

      createGroupAndText(valCenters);

      d3.select(".bubbles")
        .selectAll("circle")
        .remove();

      uniqueGeneres.forEach(genre => {
        nodesGroupByGenre.forEach(singleGroup => {
          if (singleGroup[genre] !== undefined) {
            const simulation = d3
              .forceSimulation(singleGroup[genre])
              .force(
                "collision",
                d3.forceCollide().radius(d => xScale(d.value))
              )
              .force(
                "charge",
                d3.forceManyBody().strength(d => Math.random() * -13 - 10)
              )
              .force(
                "x",
                d3
                  .forceX()
                  .x(d => genresCenter[d["genre"][0].replace(/ |&/g, "")].x)
              )
              .force(
                "y",
                d3
                  .forceY()
                  .y(d => genresCenter[d["genre"][0].replace(/ |&/g, "")].y)
              )
              .alphaDecay(0.05)
              .on("tick", ticked);

            function ticked() {
              d3.select(`.genreSingle.${genre.replace(/ |&/g, "")}`)
                .selectAll("circle")
                .data(singleGroup[genre])
                .join("circle")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", d => xScale(d.value))
                .attr("fill", d =>
                  colorGenre(
                    associateGenreToColor[d.genre[0].replace(/ |&/g, "")]
                  )
                )
                .attr("class", d => d.name + " " + d.genre[0])
                .on("mouseenter", d => {
                  const {
                    monthsCounter,
                    daysCounter,
                    hoursCounter,
                    minutesCounter
                  } = timeConvert(d.value);

                  tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 1);
                  tooltip
                    .style("left", d3.event.pageX + 20 + "px")
                    .style("top", d3.event.pageY - 37 + "px")
                    .style("background", "white")
                    .style("box-shadow", "none");

                  tooltip
                    .select(".text-tooltip")
                    .html(
                      `${d.name} ${
                        monthsCounter > 0 ? monthsCounter + "month" : ""
                      }
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
            }
          }
        });
      });
    }

    drawBubble(nodesGroup);
  })
);
