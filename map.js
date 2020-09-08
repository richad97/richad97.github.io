let formatNumber = d3.format(",.0f");

let margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 900,
  height = 335 - margin.top - margin.bottom;

let zoom = d3.zoom().scaleExtent([1, 15]).on("zoom", zoomed);

let svg = d3
  .select("#map-col")
  .append("svg")
  .attr("id", "global-map-svg")
  .attr("viewBox", "320 30 220 220")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

svg
  .append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height);

let g = svg.append("g");

svg.call(zoom); // delete this line to disable free zooming

let projection = d3
  .geoNaturalEarth1()
  .scale(width / 7)
  .translate([width / 2, height / 2]);

let path = d3.geoPath().projection(projection);

let radius = d3
  .scaleSqrt()
  .domain([0, 1e6 * 0.5])
  .range([0, 8]);

let land = g.append("path").attr("class", "land");

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  g.attr("transform", d3.event.transform); // updated for d3 v4
}

export function map(data, w, str, date) {
  let newSet = [];

  data.forEach((obj) => {
    let keyValues = {
      lat: obj["Lat"],
      long: obj["Long"],
      name: obj[str],
      total: +obj[date],
    };
    newSet.push(keyValues);
  });

  land.datum(topojson.feature(w, w.objects.land)).attr("d", path);

  let circles = g
    .attr("class", "bubbles")
    .selectAll("circle")
    .data(
      newSet.sort(function (a, b) {
        return b.total - a.total;
      })
    );

  circles
    .enter()
    .append("circle")
    .merge(circles)
    .attr("cx", (d) => projection([d.long, d.lat])[0])
    .attr("cy", (d) => projection([d.long, d.lat])[1])
    .attr("r", (d) => radius(d.total))
    .append("title");

  circles.select("title").text(function (d) {
    return `${d.name} - ${formatNumber(d.total)}`;
  });
}
