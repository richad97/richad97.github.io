let formatNumber = d3.format(",.0f");

let margin = { top: 20, right: 20, bottom: 70, left: 45 },
  width,
  height = 250 - margin.top - margin.bottom;

let svg = d3
  .select("#barchart-col")
  .append("svg")
  .attr("id", "barchart-svg")
  .attr("height", height + margin.top + margin.bottom);

let canvas = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let yGrid = canvas.append("g").attr("class", "grid");

let xScale = d3.scaleBand().padding(0.55);
let yScale = d3.scaleLinear();

let xAxis = d3.axisBottom().scale(xScale);
let yAxis = d3.axisLeft().scale(yScale).ticks(7, "s");

let xAxisEl = canvas
  .append("g")
  .attr("class", "axis axis--y")
  .attr("transform", "translate(0," + height + ")");

let yAxisEl = canvas.append("g").attr("class", "axis axis--y").call(yAxis);

function make_x_gridlines() {
  return d3.axisBottom(xScale).ticks(10);
}

function make_y_gridlines() {
  return d3.axisLeft(yScale).ticks(9);
}

export function barChart(data, str, date) {
  let arr = [];

  /*
    if (data === "gConfirmedCSV" || "gDeathsCSV" || "gRecoveredCSV") {
    } else if (data === "uConfirmedCSV" || "uDeathsCSV") {
    }
  */

  data.forEach((obj) => {
    let newObj = {
      Land: obj[str],
      date: +obj[date],
    };

    arr.push(newObj);
  });

  let newSet = arr.sort((a, b) => (a.date > b.date ? -1 : 1)).slice(0, 10);

  let xValue = (d) => d.Land;
  let yValue = (d) => d.date;

  function update() {
    xScale.domain(
      newSet.map(function (d) {
        return xValue(d);
      })
    );

    yScale.domain([
      0,
      d3.max(newSet, function (d) {
        return yValue(d);
      }),
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

    yGrid
      .transition()
      .duration(1400)
      .call(make_y_gridlines().tickSize(-width).tickFormat(""));

    let bars = svg.select("g").selectAll("rect").data(newSet);

    bars.enter().append("rect");

    bars
      .merge(bars)
      .transition()
      .duration(1400)
      .delay(function (d, i) {
        return i * 80;
      })
      .attr("x", function (d) {
        return xScale(xValue(d));
      })
      .attr("y", function (d) {
        return yScale(yValue(d));
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return height - yScale(yValue(d));
      });

    bars.append("title");

    bars.select("title").text(function (d) {
      return `${formatNumber(yValue(d))}`;
    });

    bars.exit().remove();
  }

  function draw() {
    width =
      parseInt(d3.select("#barchart-col").style("width"), 10) -
      margin.left -
      margin.right;

    svg.attr("width", width + margin.left + margin.right);

    xScale.rangeRound([0, width]);
    yScale.rangeRound([height, 0]);

    update();
  }
  update();
  draw();

  window.addEventListener("resize", draw);
}
