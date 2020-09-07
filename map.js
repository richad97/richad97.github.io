let formatNumber = d3.format(",.0f");

let margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 800 - margin.left - margin.right,
  height = 335 - margin.top - margin.bottom;

let svg = d3
  .select("#map-col")
  .append("svg")
  .attr("id", "global-map-svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .call(
    d3.zoom().on("zoom", function () {
      svg.attr("transform", d3.event.transform);
    })
  )
  .append("g");

let projection = d3
  .geoNaturalEarth1()
  .scale(width / 7)
  .translate([width / 2, height / 1.45]);

let path = d3.geoPath().projection(projection);

let radius = d3
  .scaleSqrt()
  .domain([0, 1e6 * 0.3])
  .range([0, 8]);

let land = svg.append("path").attr("class", "land");

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

  let circles = svg
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
