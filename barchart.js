const formatNumber = d3.format(",.0f");

const margin = { top: 20, right: 20, bottom: 70, left: 45 },
  height = 250 - margin.top - margin.bottom;

let width;

const svg = d3
  .select("#barchart-col")
  .append("svg")
  .attr("id", "barchart-svg")
  .attr("height", height + margin.top + margin.bottom);

const rect = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3.scaleBand().padding(0.55);
const yScale = d3.scaleLinear();

const xAxis = d3.axisBottom().scale(xScale);
const yAxis = d3.axisLeft().scale(yScale).ticks(7, "s");

const yAxisG = rect.append("g").call(yAxis);

const xAxisG = rect
  .append("g")
  .attr("transform", "translate(0," + height + ")");

const yGrid = rect.append("g").attr("class", "grid");

const make_x_gridlines = () => {
  return d3.axisBottom(xScale).ticks(10);
};

const make_y_gridlines = () => {
  return d3.axisLeft(yScale).ticks(9);
};

export function barChart(data, str, date) {
  const arr = [];

  data.forEach((obj) => {
    const newObj = {
      land: obj[str],
      date: +obj[date],
    };
    arr.push(newObj);
  });

  const newSet = arr.sort((a, b) => (a.date > b.date ? -1 : 1)).slice(0, 10);

  const xValue = (d) => d.land;
  const yValue = (d) => d.date;

  function update() {
    xScale.domain(
      newSet.map((d) => {
        return xValue(d);
      })
    );

    yScale.domain([
      0,
      d3.max(newSet, (d) => {
        return yValue(d);
      }),
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

    yGrid
      .transition()
      .duration(1400)
      .call(make_y_gridlines().tickSize(-width).tickFormat(""));

    const bars = rect.select("g").selectAll("rect").data(newSet);

    bars.enter().append("rect");

    bars
      .merge(bars)
      .transition()
      .duration(1400)
      .delay((d, i) => {
        return i * 80;
      })
      .attr("x", (d) => {
        return xScale(xValue(d));
      })
      .attr("y", (d) => {
        return yScale(yValue(d));
      })
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => {
        return height - yScale(yValue(d));
      });

    bars.append("title");

    bars.select("title").text((d) => {
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
