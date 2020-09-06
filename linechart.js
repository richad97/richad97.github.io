let margin = { top: 20, right: 20, bottom: 70, left: 45 },
  width,
  height = 250 - margin.top - margin.bottom;

let svg = d3
  .select("#linegraph-col")
  .append("svg")
  .attr("id", "linechart-svg")
  .attr("height", height + margin.top + margin.bottom);

let canvas = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let label = canvas.append("text").attr("class", "linechart-title");

let xGrid = canvas
  .append("g")
  .attr("class", "grid")
  .attr("transform", "translate(0," + height + ")");

let yGrid = canvas.append("g").attr("class", "grid");

let xScale = d3.scaleTime();
let yScale = d3.scaleLinear().range([height, 0]);

let xAxis = d3.axisBottom().scale(xScale);
let yAxis = d3.axisLeft().scale(yScale).ticks(6, "s");

let line = d3.line();

let path = canvas.append("path").attr("class", "line");

let xAxisEl = canvas
  .append("g")
  .attr("class", "y-axis")
  .attr("transform", "translate(0," + height + ")");

let yAxisEl = canvas.append("g").attr("class", "y-axis").call(yAxis);

function make_x_gridlines() {
  return d3.axisBottom(xScale).ticks(10);
}

function make_y_gridlines() {
  return d3.axisLeft(yScale).ticks(6);
}

export function lineChart(data, th) {
  let sum = data.reduce(function (a, b) {
    Object.keys(b).forEach(function (key) {
      a[key] = (a[key] || 0) + +b[key];
    });
    return a;
  }, {});

  // REVISE! SHAVES BEGINNING DATES WHEN US IS CALLED BUT WORKS // DAYS WERE ZERO

  let date = Object.keys(sum).slice(12),
    total = Object.values(sum).slice(12);

  // REVISE!

  let newSet = [];

  date.forEach((num1, index) => {
    let object1 = {};

    let num2 = total[index];

    object1["Dates"] = new Date(num1);
    object1["Total"] = num2;

    newSet.push(object1);
  });

  let xValue = (d) => d.Dates;
  let yValue = (d) => d.Total;

  function update() {
    path.data([newSet]).attr("class", "line-graph");

    xScale.domain(d3.extent(newSet, xValue));
    yScale.domain([
      d3.min(newSet, (d) => Math.floor(yValue(d) - 200)),
      d3.max(newSet, (d) => Math.floor(yValue(d) + 200)),
    ]);

    xAxis.scale(xScale);
    yAxis.scale(yScale);

    xAxisEl
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("y", "1.5em")
      .attr("transform", "rotate(-35)");
    yAxisEl.call(yAxis);

    line
      .x((d) => xScale(xValue(d)))
      .y((d) => yScale(yValue(d)))
      .curve(d3.curveMonotoneX);

    path.transition().duration(1400).attr("d", line);

    yGrid
      .transition()
      .duration(1400)
      .call(make_y_gridlines().tickSize(-width).tickFormat(""));
  }

  function drawChart() {
    width =
      parseInt(d3.select("#linegraph-col").style("width"), 10) -
      margin.left -
      margin.right;

    svg.attr("width", width + margin.left + margin.right);

    label
      .attr("x", width / 8)
      .attr("y", height / 10 - 40)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "none")
      .text(`Top Ten ${th}`);

    xScale.range([0, width]);

    update();
  }

  drawChart();

  window.addEventListener("resize", drawChart);
}
