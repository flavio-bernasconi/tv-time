import React from "react";
import * as d3 from "d3";
import { observer, inject } from "mobx-react";
import { cloneDeep } from "lodash";

const width = window.innerWidth;
const height = window.innerHeight;
const maxDomain = 1440 * 365;

export const BubbleChart = inject("state")(
  observer(function BubbleChart({ state }) {
    const { dataset } = state;
    const nodesGroup = cloneDeep(dataset);

    const chart = d3
      .select(".bubbles")
      .attr("width", width)
      .attr("height", 400)
      .attr("transform", `translate(0,0)`);

    d3.select(".chart-container")
      .append("div")
      .attr("class", "testtttt");

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

      const genresCenter = {};

      const xCenterScale = d3
        .scaleLinear()
        .domain([0, uniqueGeneres.length])
        .range([0, width]);

      uniqueGeneres.forEach(
        (genre, i) =>
          (genresCenter[genre] = {
            x: xCenterScale(i) + 30
          })
      );

      const valCenters = Object.entries(genresCenter).map(([label, val]) => [
        label,
        val.x
      ]);

      function sortArrWithReference(arrToSort, ref) {
        arrToSort.sort(function(a, b) {
          return ref.indexOf(a.genre[0]) - ref.indexOf(b.genre[0]);
        });
      }

      sortArrWithReference(nodesGroup, uniqueGeneres);

      //   jsonAnonymized = dataJson.map((element, index) => {
      //     const el = { ...element }
      //     keys.forEach((key, i) => {
      //       el[key] = anonymizedValues[i][index].anonymizedValue
      //     })

      //     return el
      //   })
      // }

      const simulation = d3
        .forceSimulation()
        .force(
          "collision",
          d3.forceCollide().radius(d => xScale(d.value))
        )
        .force("charge", d3.forceManyBody())
        .force(
          "x",
          d3.forceX().x(function(d) {
            console.log(genresCenter[d["genre"][0].replace(/ |&/g, "")].x);
            return genresCenter[d["genre"][0].replace(/ |&/g, "")].x;
          })
        )
        .force("y", d3.forceY().y(100));

      simulation.nodes(nodesGroup).on("tick", ticked);

      nodesGroup.forEach((d, i) => {
        d3.select("." + d["genre"][0].replace(/ |&/g, ""))
          .append("circle")
          .attr("fill", "red")
          .attr("class", d.name + " " + d.genre[0])
          .attr("r", 0);
        // .transition()
        // .duration(500)
        // .attr("r", xScale(d.value) * 3);
      });

      function ticked() {
        // nodesGroup.forEach((d, i) => {
        //   chart
        //     .select("." + d["genre"][0].replace(/ |&/g, ""))
        //     .selectAll("circle")
        //     .attr("cx", d.x)
        //     .attr("cy", d.y);
        // });

        chart
          .selectAll("circle")
          .data(nodesGroup)
          .join("circle")
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .attr("r", d => xScale(d.value) * 2)
          .attr("fill", "red")
          .attr("class", d => d.name + " " + d.genre[0]);
      }

      function addText(labels) {
        const group = chart
          .selectAll("g")
          .data(labels)
          .enter();

        group
          .append("g")
          .attr("class", d => d[0] + " genreSingle")
          .attr("x", (d, i) => d[1])
          .attr("height", 100);

        d3.selectAll("text").remove();

        labels.forEach((d, i) => {
          d3.select(`.${d[0].replace(/ |&/g, "")}`)
            .append("text")
            .text(d[0])
            .attr("y", 50)
            .attr("x", d => d[1] - 20)
            .attr("font-size", "12px")
            .attr("fill", "red");
        });
      }

      addText(valCenters);
    }

    drawBubble(nodesGroup);
  })
);
