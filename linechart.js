const margin = { top: 20, right: 20, bottom: 70, left: 45 },
  height = 250 - margin.top - margin.bottom;

let width;

const svg = d3
  .select("#linegraph-col")
  .append("svg")
  .attr("id", "linechart-svg")
  .attr("height", height + margin.top + margin.bottom);

const rect = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const line = d3.line();

const path = rect.append("path").attr("class", "line");

const xScale = d3.scaleTime();
const yScale = d3.scaleLinear().range([height, 0]);

const xAxis = d3.axisBottom().scale(xScale);
const yAxis = d3.axisLeft().scale(yScale).ticks(6, "s");

const xAxisG = rect
  .append("g")
  .attr("transform", "translate(0," + height + ")");

const yAxisG = rect.append("g").call(yAxis);

const xGrid = rect
  .append("g")
  .attr("class", "grid")
  .attr("transform", "translate(0," + height + ")");

const yGrid = rect.append("g").attr("class", "grid");

const make_x_gridlines = () => {
  return d3.axisBottom(xScale).ticks(10);
};

const make_y_gridlines = () => {
  return d3.axisLeft(yScale).ticks(6);
};

export function lineChart(data) {
  const sum = data.reduce((a, b) => {
    Object.keys(b).forEach((key) => {
      a[key] = (a[key] || 0) + +b[key];
    });
    return a;
  }, {});

  // REVISE! SHAVES LIKE 7 DAYS IN BEGINNING

  const date = Object.keys(sum).slice(12),
    total = Object.values(sum).slice(12);

  // REVISE!

  const newSet = [];

  date.forEach((num1, index) => {
    const object1 = {};

    const num2 = total[index];

    object1["Dates"] = new Date(num1);
    object1["Total"] = num2;

    newSet.push(object1);
  });

  const xValue = (d) => d.Dates;
  const yValue = (d) => d.Total;

  function update() {
    path.data([newSet]).attr("class", "line-graph");

    xScale.domain(d3.extent(newSet, xValue));
    yScale.domain([
      d3.min(newSet, (d) => Math.floor(yValue(d) - 200)),
      d3.max(newSet, (d) => Math.floor(yValue(d) + 200)),
    ]);

    xAxis.scale(xScale);
    yAxis.scale(yScale);

    xAxisG
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("y", "1.5em")
      .attr("transform", "rotate(-35)");

    yAxisG.call(yAxis);

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

    xScale.range([0, width]);

    update();
  }

  drawChart();

  window.addEventListener("resize", drawChart);
}
